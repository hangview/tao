import axios from 'axios';

export function getUrl(url) {
    return axios.post('https://api.taokouling.com/tkl/tkljm',
        {
            apikey: "LkAZCqAYZA",
            tkl: url,
        }).then(res => res);
}
