import { createContextualCan } from '@casl/react';
import { AbilityBuilder, MongoAbility, PureAbility, createMongoAbility } from "@casl/ability";
import React from 'react';


const ability = new PureAbility<['read' | 'update', 'Article']>([
    { action: 'read', subject: 'Article' },
    { action: 'update', subject: 'Article' },
]);

type Abilities = ['read' | 'create' | 'update' | 'delete' | 'manage', 'User' | 'all'];
type AppAbility = MongoAbility<Abilities>;
type User = {
    role: string
}
export function defineAbilityFor(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    if (user.role === 'admin') {
        can('manage', 'all');
    }
    return build();
}


export const AbilityContext = React.createContext({} as AppAbility);
export const Can = createContextualCan(AbilityContext.Consumer);
