import React, { useEffect, useState } from "react";
import Select from "react-select"
import { callApi } from "../services";

const SelectLocationComp = React.forwardRef(({
    onSelected = () => {},
    LocationId = -1,
    isNewStyle = false
}, ref)=>{

    const [data, setData] = useState([]);
    const [valueS, setValueS] = useState();
    const onSelecteItem = (item) => {
        onSelected(item);
        setValueS(item);
    };

    const LocationID = LocationId;
    const CPN_spLocation_Area_List = async () => {
        if (LocationID === -1) {
            !isNewStyle 
            ? setValueS({ value: 0, label: 'Vui lòng chọn' })
            :  setValueS({ value: 0, label: 'Chọn Khư Vực' })
            setData([]);
            return;
        }
        const params = {
            Json: JSON.stringify({OfficeID: 0}),
            func: "CPN_spLocation_Area_List",
            API_key: "netcoApikey2025"
        };

        const list = await callApi.Main(params);
        const FirstData = { value: 0, label: "Vui lòng chọn" };
        let dataSelect = [],
        IsActive = 0;
        dataSelect.push(FirstData);
        list && list?.length > 0 && list.forEach((element, index) => {
        dataSelect.push({
            value: element.ID,
            label: element.Name,
        });
        if (element.ID === LocationId) {
            IsActive = 1;
        }
        });

        setData(dataSelect);
        if (IsActive === 1) {
        let ListActive = list.filter((a) => a.ID === LocationId)[0];
        setValueS({
            value: ListActive.ID,
            label: ListActive.Name,
        });
        }
    };

    useEffect(() => {
        CPN_spLocation_Area_List();
    }, []);

    useEffect(() => {
        if (LocationId !== 0 && LocationId !== -1) {
            let ar = data.find((a) => a.value === LocationId);
            ar ? setValueS(ar) : setValueS({ value: 0, label: "Vui lòng chọn" });
        } else {
            setValueS({ value: 0, label: "Vui lòng chọn" });
        }
    }, [LocationId]);

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

export const SelectLocation = React.memo(SelectLocationComp);