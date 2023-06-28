import React, { useEffect, useState } from "react";
import Select from "react-select";
import { callApi } from "../services";

const SelectPostOfficerComp = React.forwardRef(({
    onSelected = () => {},
    PostID = -1,
    LocationId = -1,
    isNewStyle = false
}, ref) => {

    const [data, setData] = useState([]);
    const [valueS, setValueS] = useState();
    const onSelecteItem = (item) => {
        onSelected(item);
        setValueS(item);
    };

    const Postid = PostID;
    const CPN_spSelectPostOffice_List = async () => {
        if (Postid === -1) {
            setValueS({ value: 0, label: 'Vui lòng chọn' });
            setData([]);
            return;
        }
        const params = {
            Json: JSON.stringify({LocationId: LocationId}),
            func: "CPN_spSelectPostOffice_List",
            API_key: "netcoApikey2025"
        };

        const list = await callApi.Main(params);
        const FirstData = { value: 0, label: "Vui lòng chọn" };
        let dataSelect = [],
            IsActive = 0;
        dataSelect.push(FirstData);
        list && list?.length > 0 && list.forEach((e,i)=>{
            if (e.PostOfficeID === Postid) {
                IsActive = 1;
            };

            dataSelect.push({
                value: e.PostOfficeID,
                label: e.POName,
            });
        });
        setData(dataSelect);
        if (IsActive === 1) {
            let ListActive = list.filter((a) => a.PostOfficeID === Postid)[0];
            setValueS({
                value: ListActive.PostOfficeID,
                label: ListActive.POName,
            });
        }
    };

    useEffect(() => {
        CPN_spSelectPostOffice_List();
    }, [LocationId]);

    useEffect(() => {
        if (PostID !== 0 && PostID !== -1) {
            let ar = data.find((a) => a.value === PostID);
            ar ? setValueS(ar) : setValueS({ value: 0, label: "Vui lòng chọn" });
        } else {
            setValueS({ value: 0, label: "Vui lòng chọn" });
        }
    }, [PostID]);

    return (
        <Select
            className="SelectMeno"
            id="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
            ref={ref}
        />
    );
});

export const SelectPostOfficer = React.memo(SelectPostOfficerComp);