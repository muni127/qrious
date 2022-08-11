import React from 'react';
import { render, screen } from '@testing-library/react';

// Types
import { Person } from '../types/Person';

// Components
import {
    findCouples,
    findImmediateChildren,
    findOrphans,
    findParents,
    findPartners,
    findPerson,
    findRelatives,
    findUnqiueCouples,
    findUnqiuePeople,
    isOrphan,
    isSingle,
    Tree,
} from '../Tree';

// Test Data
import { familyTree } from '../../../data/family-tree.data';

const suzieTestData: Person = {
    id: 7777,
    name: 'Suzie',
    gender: 'female',
    children: [317849882, 8569047194214199353],
    parents: [2351232112252, 1231239887112],
};

const sallyTestData: Person = {
    id: 2351232112252,
    name: 'Sally',
    children: [5555, 6666, 7777, 8458189966444, 897543276547654765443576],
    gender: 'female',
    parents: [],
};

const billyTestData: Person = {
    id: 1231239887112,
    name: 'Billy',
    children: [8458189966444, 5555, 6666, 7777, 897543276547654765443576],
    gender: 'male',
    parents: [],
};

describe('Tree component', () => {
    describe('findParents', () => {
        it('Returns all parents of the provided person given the list of available people', () => {
            expect(findParents(familyTree, suzieTestData)).toEqual([sallyTestData, billyTestData]);
        });
        it('Returns no parents if provided no people', () => {
            expect(findParents([], suzieTestData)).toEqual([]);
        });
    });
    describe('isOrphan', () => {
        it('Returns false if person has parents', () => {
            expect(isOrphan(familyTree, suzieTestData)).toEqual(false);
        });
        it('Returns true if person has no parents', () => {
            expect(isOrphan([], suzieTestData)).toEqual(true);
        });
    });
    describe('findOrphans', () => {
        it('Returns orphans if parent can not be found', () => {
            expect(findOrphans([suzieTestData])).toEqual([suzieTestData]);
        });
        it('Returns orphans only for records with no parents', () => {
            expect(findOrphans([sallyTestData, suzieTestData])).toEqual([sallyTestData]);
        });
    });
    describe('findOrphans', () => {
        it('Returns orphans if parent can not be found', () => {
            expect(findOrphans([suzieTestData])).toEqual([suzieTestData]);
        });
        it('Returns orphans only for records with no parents', () => {
            expect(findOrphans([sallyTestData, suzieTestData])).toEqual([sallyTestData]);
        });
    });
    describe('findPartners', () => {
        it('Returns partners for the provided person if they share at least one child', () => {
            expect(findPartners([billyTestData], sallyTestData)).toEqual([billyTestData]);
        });
        it('Returns no records if no partner can be found sharing at least one child', () => {
            expect(findPartners([suzieTestData], sallyTestData)).toEqual([]);
        });
    });
    describe('isSingle', () => {
        it('Returns true if at least one partner can be found', () => {
            expect(isSingle([billyTestData], sallyTestData)).toEqual(false);
        });
        it('Returns false if no partner can be found', () => {
            expect(isSingle([suzieTestData], sallyTestData)).toEqual(true);
        });
    });
    describe('findPerson', () => {
        it('Returns a person if they can be found in the list', () => {
            expect(findPerson(familyTree, sallyTestData)).toEqual(sallyTestData);
        });
        it('Returns no records the person can not be found in the list', () => {
            expect(findPerson([sallyTestData, billyTestData], suzieTestData)).toEqual(undefined);
        });
    });
    describe('findUnqiuePeople', () => {
        it('Returns a unique list of people provided a list of people', () => {
            expect(findUnqiuePeople([sallyTestData, sallyTestData, billyTestData, billyTestData])).toEqual([sallyTestData, billyTestData]);
        });
    });
    describe('findCouples', () => {
        it('Returns a list of people who are couples out of the list provided', () => {
            expect(findCouples([sallyTestData, billyTestData])).toEqual([
                [sallyTestData, billyTestData],
                [billyTestData, sallyTestData],
            ]);
        });
        it('Returns nothing if no couples can be found', () => {
            expect(findCouples([sallyTestData, suzieTestData])).toEqual([]);
        });
    });
    describe('findUnqiueCouples', () => {
        it('Returns a list of people who are couples out of the list provided', () => {
            expect(findUnqiueCouples([sallyTestData, billyTestData])).toEqual([
                [sallyTestData, billyTestData],
            ]);
        });
        it('Returns nothing if no couples can be found', () => {
            expect(findUnqiueCouples([sallyTestData, suzieTestData])).toEqual([]);
        });
    });
    describe('findImmediateChildren', () => {
        it('Returns a list of people who are the first generation children in the list', () => {
            expect(findImmediateChildren([sallyTestData, suzieTestData], [sallyTestData])).toEqual([suzieTestData]);
        });
        it('Returns nothing if no immediate children can be found', () => {
            expect(findImmediateChildren([sallyTestData, billyTestData], [sallyTestData])).toEqual([]);
        });
    });
    describe('findRelatives', () => {
        it('Returns a list of related people', () => {
            expect(findRelatives([suzieTestData], [sallyTestData])).toEqual([suzieTestData]);
        });
        it('Returns nothing if no relationship can be found', () => {
            expect(findRelatives([sallyTestData], [billyTestData])).toEqual([]);
        });
    });
    it('renders a tree', () => {
        render(<Tree people={familyTree} />);
        const nameLabelElement = screen.getByText(suzieTestData.name);
        expect(nameLabelElement).toBeInTheDocument();
    });
});

export {};
