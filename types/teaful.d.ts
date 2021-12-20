declare module 'teaful' {

    export default function createStore<T extends {}>(defaultStore: T, callback?: OnAfterUpdate): {
        useStore: {
            [Key in keyof T]: () => [T[Key], (value: T[Key] | ((prev: T[Key]) => T[Key])) => void]
        };
        getStore: {
            [Key in keyof T]: () => [T[Key], (value: T[Key] | ((prev: T[Key]) => T[Key])) => void]
        };
        withStore: any;
    };
}

type OnAfterUpdate<T> = (props: { store: {
    [Key in keyof T]: T[Key]
} }) => any


type TeafulUpdateFunction<T> = (value: T | ((prev: T) => T)) => void