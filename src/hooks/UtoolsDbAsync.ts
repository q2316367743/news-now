import {ref, Ref, shallowRef, toValue, watch} from "vue";
import {getFromOneByAsync, removeOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";



export interface UseUtoolsDbOptions {
    flush?: 'pre' | 'post' | 'sync';
    deep?: boolean;
    writeDefaults?: boolean;
    shallow?: boolean;

    onError?(e: any): void;
}

/**
 * 异步对象存储
 */
export function useUtoolsDbAsync<T extends (string | number | boolean | object | null)>(
    key: string,
    initialValue: T,
    options: UseUtoolsDbOptions = {},
): Ref<T> {
    const {
        flush = 'pre',
        deep = true,
        writeDefaults = true,
        shallow,
        onError = (e) => {
            console.error(e)
        },
    } = options

    const rawInit: T = toValue(initialValue)
    let rev: string | undefined = undefined;

    const data = (shallow ? shallowRef : ref)(initialValue) as Ref<T>

    async function getItem(key: string) {
        const doc = await getFromOneByAsync(key);
        if (doc) {
            rev = doc.rev;
            return doc.record;
        }
        return null;
    }

    async function setItem<T = any>(key: string, value: T) {
        rev = await saveOneByAsync(key, value, rev);
    }

    async function removeItem(key: string) {
        await removeOneByAsync(key);
    }

    async function read(event?: StorageEvent) {
        if (event && event.key !== key)
            return

        try {
            const rawValue = event ? event.newValue : await getItem(key)
            if (rawValue == null) {
                data.value = rawInit
                if (writeDefaults && rawInit !== null)
                    await setItem(key, rawInit)
            } else {
                data.value = rawValue;
            }
        } catch (e) {
            onError(e)
        }
    }

    read()


    watch(
        data,
        async () => {
            try {
                if (data.value == null)
                    await removeItem(key)
                else
                    await setItem(key, data.value)
            } catch (e) {
                onError(e)
            }
        },
        {
            flush,
            deep,
        },
    )

    return data as Ref<T>
}
