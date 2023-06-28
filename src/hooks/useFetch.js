import { useEffect, useState } from "react";

export const useFetch = (pr, st) => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState([]);

    let json = {
        Json: pr,
        func: st,
        API_key: "netcoApikey2025"
    }

    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            const response = await fetch(
                `http://api-v4-erp.chuyenphatnhanh.vn/api/ApiMain/API_spCallServer`,
                 {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      redirect: 'follow', // manual, *follow, error
                      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                      body: JSON.stringify(json) // body data type must match "Content-Type" header
                 }
            );
            const data = await response.json();
            setData(data.hits);
            setStatus('fetched');
        };

        fetchData();
    }, [st]);

    return {  data, status };
};
