'use client'
import { useSearchParams, useRouter } from "next/navigation";
import { unknown } from "zod";

interface IStorageService {
    presignedGetObject: (filename: string) => Promise<any>
}


export default function useStorageService(): IStorageService {
    const router = useRouter();
    return {
        presignedGetObject: async (filename) => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/minio/presignedGetObject?name=' + filename, {
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                })
                return await response.json()
            } catch (error: any) {
                return { status: 500, message: error.message }
            }
        },
    }


}