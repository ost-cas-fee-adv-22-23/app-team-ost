import { decodeTime } from 'ulid';
import { Mumble } from '../../types/mumble';
import { User } from '../../types/user';
import { fetchUserById } from './user-api-functions';


type BasePost = {
    id: string;
    creator: string;
    text: string;
    mediaUrl?: string;
    mediaType?: string;
    likeCount: number;
    likedByUser: boolean;
};

type Post = BasePost & {
    type: 'post';
    replyCount: number;
};

type Reply = BasePost & {
    type: 'reply';
    parentId: string;
};

type DeletedPost = {
    type: 'deleted';
    id: string;
    creator: string;
    parentId?: string;
};

type ApiPostResult = Post | Reply | DeletedPost;



type QwackerMumbleResponse = {
    count: number;
    data: ApiPostResult[];
};

export type UploadImage = File & { preview: string };

export const fetchMumbles = async (params?: {
    token?: string;
    limit?: number;
    offset?: number;
    newerThanMumbleId?: string;
    creator?: string;
}) => {
    const { token, limit, offset, newerThanMumbleId, creator } = params || {};

    const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts?${new URLSearchParams({
        limit: limit?.toString() || '10',
        offset: offset?.toString() || '0',
        newerThan: newerThanMumbleId || '',
        creator: creator || '',
    })}`;

    const res = await fetch(url, {
        headers: {
            'content-type': 'application/json',
        },
    });
    const { count, data } = (await res.json()) as QwackerMumbleResponse;

    let mumbles = await Promise.all( data.map( async(mumble) => await transformMumble(mumble, token)));

    // mumbles = await Promise.all(
    //     mumbles.map(async (mumble) => {
    //         if (token) {
    //             const user: User = await fetchUserById({ id: mumble.creator as string, accessToken: token });
    //             mumble.creator = user;
    //         } else {
    //             const creator: User = {
    //                 id: mumble.id,
    //                 userName: 'anonym',
    //                 firstName: '',
    //                 lastName: '',
    //                 displayName: '',
    //             };
    //             mumble.creator = creator;
    //         }
    //         return mumble;
    //     })
    // );

    return {
        count,
        mumbles,
    };
};

export const postMumble = async (text: string, file: UploadImage | null, accessToken?: string) => {
    if (!accessToken) {
        throw new Error('No access token');
    }

    const formData = new FormData();
    formData.append('text', text);
    if (file) {
        formData.append('image', file);
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error('Something was not okay');
        }

        return transformMumble(await response.json());
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Could not post mumble');
    }
};
const transformMumble = async (mumble: ApiPostResult, token?: string) => {
    const creator = await fetchUserById({ id: mumble.creator as string, accessToken: token });
    return ( {
        ...mumble,
        creator,
        createdAt: new Date(decodeTime(mumble.id)).toISOString(),
    }

    )
}
