import React, { useEffect, useState } from "react";
import Select from "react-select";
import { callApi } from "../services";

const SelectDeparmentComp = React.forwardRef(({
    onSelected = () => {},
    DeparmentID = -1,
    PostID = -1,
    isNewStyle = false
}, ref)=>{

    const [data, setData] = useState([]);
    const [valueS, setValueS] = useState();
    const onSelecteItem = (item) => {
        onSelected(item);
        setValueS(item);
    };

    const Deparmentid = DeparmentID;
    const CPN_spDeparment_List = async () => {
        if (Deparmentid === -1) {
            setValueS({ value: 0, label: 'Vui lòng chọn' });
            setData([]);
            return;
        }
        const params = {
            Json: JSON.stringify({PostOfficeID: PostID}),
            func: "CPN_spDeparment_List",
            API_key: "netcoApikey2025"
        };

        const list = await callApi.Main(params);
        const FirstData = { value: 0, label: "Vui lòng chọn" };
        let dataSelect = [],
        IsActive = 0;
        dataSelect.push(FirstData);
        list && list?.length > 0 && list.forEach((element, index) => {
            dataSelect.push({
                value: element.DeparmentID,
                label: element.DeparmentName,
            });

            if (element.DeparmentID === Deparmentid) {
                IsActive = 1;
            }
        });

        setData(dataSelect);
        if (IsActive === 1) {
            let ListActive = list.filter((a) => a.DeparmentID === Deparmentid)[0];
            setValueS({
                value: ListActive.DeparmentID,
                label: ListActive.DeparmentName,
            });
        }
    };

    useEffect(() => {
        CPN_spDeparment_List();
    }, [PostID]);

    useEffect(() => {
        if (DeparmentID !== 0 && DeparmentID !== -1) {
            let ar = data.find((a) => a.value === DeparmentID);
            ar ? setValueS(ar) : setValueS({ value: 0, label: "Vui lòng chọn" });
        } else {
            setValueS({ value: 0, label: "Vui lòng chọn" });
        }
    }, [DeparmentID]);

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
}
);

export const SelectDeparment = React.memo(SelectDeparmentComp);