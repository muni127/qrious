// Types
import type { Person } from './Person';

export interface TreeProps {
    people: Person[];
    parents?: Person[];
    usedPeople?: Person[];
}
