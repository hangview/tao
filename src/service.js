import axios from 'axios';

export function getUrl(url) {
    const code = getCode(url);
    return axios.post('/api/tkl/tkljm',
        {
            apikey: "LkAZCqAYZA",
            tkl: code,
        }).then(res => res);
}

export function getMediaUrl(url) {
    if (!url && !url.includes('wh_cid='))
        return '';
    const temp = url.split('wh_cid=')[1];
    const res = temp.split('&')[0];
    return {
        mediaUrl: `http://livenging.alicdn.com/mediaplatform/${res}_merge.m3u8`,
        mediaId: res,
    }
}


function getCode(url) {
    if (url && url.includes("fu制此条消息")) {
        url = url.split("fu制此条消息")[1] && url.split("fu制此条消息")[1].split('，')[0];
    }
    return url;
}
