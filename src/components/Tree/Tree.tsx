import React from 'react';
import Lodash from 'lodash';

// Styles
import './Tree.css';

// Types
import { Person } from './types/Person';
import { TreeProps } from './types/TreeProps';

// Assets
import peopleIcon from '../../assets/people.svg';

/**
 * Find all people who are parents of this decendant
 */
export const findParents = (people: Person[], decendant: Person) => (
    decendant.parents.length > 0
        ? people.filter((person) => (
            decendant.parents.includes(person.id)
        ))
        : []
);

/**
 * Check if this person do not have parents
 */
export const isOrphan = (people: Person[], person: Person) => findParents(people, person).length === 0;

/**
 * Find all people who do not have parents
 */
export const findOrphans = (people: Person[]) => people.filter((person) => isOrphan(people, person));

/**
 * Find all people who are partners of this person i.e. share the same child
 */
export const findPartners = (people: Person[], partner: Person) => (
    partner.children.length === 0
        ? []
        : people.filter((person) => (
            person.id !== partner.id
            && Lodash.intersection(person.children, partner.children).length > 0
        ))
);

/**
 * Check if this person do not have partners
 */
export const isSingle = (people: Person[], person: Person) => findPartners(people, person).length === 0;

/**
 * Find person by id
 */
export const findPerson = (people: Person[], target: Person) => people.find((person) => (
    person.id === target.id
));

/**
 * Get two groups of people who are intersecting
 */
export const getIntersectingGroup = (a: Person[], b: Person[]) => Lodash.intersectionBy(a, b, 'id');

/**
 * Find all unique people out of the provided list by id
 */
export const findUnqiuePeople = (people: Person[]) => Lodash.uniqBy(people, 'id');

/**
 * Create a unique tree id using parents of the tree
 * No tree should have the same parent passed in for rendering
 */
export const generateTreeId = (parents: Person[]) => parents.reduce((prev, person) => `${prev}_${person.id}`, '');

/**
 * Find all orphans and their orphan partners for the current level in the tree
 */
export const findCouples = (people: Person[]) => people.map((person) => [
    person,
    ...findPartners(people, person),
]).filter((couple) => couple.length > 1);

/**
 * Find all non repeated couples
 */
export const findUnqiueCouples = (people: Person[]) => Lodash.uniqWith(
    findCouples(people),
    (a, b) => getIntersectingGroup(a, b).length > 1,
);

/**
 * Find all orphans and their orphan partners for the current level in the tree
 */
export const findOrphansCouples = (people: Person[]) => {
    const orphans = findOrphans(people);

    return findUnqiueCouples(orphans);
};

/**
 * Find all immediate children based on parents
 */
export const findImmediateChildren = (people: Person[], parents: Person[]) => people.filter((person) => !isOrphan(parents, person));

/**
 * Find a list of related people based on parents and children
 */
export const findRelatives = (people: Person[], parents: Person[]): Person[] => {
    const couples = findUnqiueCouples(people);
    const relatedChildren = findImmediateChildren(people, parents);
    // Get all couples that connect to the related children
    const relatedCouples = couples.filter((couple) => getIntersectingGroup(couple, relatedChildren).length > 0);
    const relatives = findUnqiuePeople(relatedChildren.concat(Lodash.flatten(relatedCouples)));
    const unprocessedPeople = relatives.length === 0
        ? []
        : people.filter((person) => !findPerson(relatives, person));

    return relatives.length === 0
        ? []
        : relatives.concat(findRelatives(
            unprocessedPeople,
            relatives,
        ));
};

/**
 * Recursive Tree Component
 */
export function Tree({
    people,
    parents = [],
}: TreeProps) {
    const couples = findOrphansCouples(people);
    const coupledPeople = Lodash.flatten(couples);
    const singleImmediateChildren = findImmediateChildren(people, parents).filter((person) => isSingle(coupledPeople, person));
    const usedPeople = coupledPeople.concat(singleImmediateChildren);
    const unprocessedPeople = people.filter((person) => !findPerson(usedPeople, person));
    const hasParents = parents.length > 0;
    const childrenCount = couples.length + singleImmediateChildren.length;
    const hasChildren = childrenCount > 0;
    // const hasOddChildren = childrenCount % 2 !== 0;

    return hasParents || hasChildren
        ? (
            <div className="lane">
                {hasParents
                    ? (
                        <div className="row">
                            <div className="lane">
                                {parents.map((parent) => ( // Render the current parents
                                    <div key={parent.id}
                                        className={`node ${parent.gender}`}
                                    >
                                        <img className="icon"
                                            src={peopleIcon}
                                            alt="People Icon"
                                        />
                                        <h2>{parent.name}</h2>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                    : null}
                {hasChildren
                    ? (
                        <div className="row is-children">
                            {/* {hasParents
                                ? (
                                    <>
                                        <div className="line parent-line" />
                                        {(childrenCount > 1)
                                            ? <div className="line" />
                                            : null}
                                        {(hasOddChildren)
                                            ? <div className="line odd-child-line" />
                                            : null}
                                    </>
                                )
                                : null} */}
                            {couples.map((couple) => ( // Render the current parent's children
                                <Tree key={generateTreeId(couple)}
                                    people={findRelatives(unprocessedPeople, couple)}
                                    parents={couple}
                                />
                            ))}
                            {singleImmediateChildren.map((singleChild) => ( // Render the current single children
                                <Tree key={generateTreeId([singleChild])}
                                    people={[]}
                                    parents={[singleChild]}
                                />
                            ))}
                        </div>
                    )
                    : null}
            </div>
        )
        : null;
}
