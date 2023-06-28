import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { callApi } from '../services';

const SelectPostComp = React.forwardRef(({
    onSelected = () => { },
    AreaId = 0,
    OfficerId = 0,
    onPost = 0,
    isMulti = false,
    isDisabled= false,
    isdisabledID = 0,
    isNewStyle = false
}, ref) => {

    const [data, setData] = useState([])
    const [valueS, setValueS] = useState()

    const onSelecteItem = (item) => {

        onSelected(item)
        setValueS(item);
    }

    const AreaID = AreaId;

    const CPN_spPostOffice_ByAreaId = async () => {
        if (AreaID === -1) {
            !isNewStyle 
            ? setValueS({ value: 0, label: 'Vui lòng chọn' })
            :  setValueS({ value: 0, label: 'Chọn bưu cục' })
            setData([]);
            return;
        }
        const params = {
            Json: JSON.stringify({ AreaId: AreaID,OfficerId:OfficerId }),
            func: "CPN_spPostOffice_ByAreaId",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
       
        const FirstData = !isNewStyle 
        ? { value: 0, label: 'Vui lòng chọn' ,addressId:0,wardId :0 }
        :  { value: 0, label: 'Chọn bưu cục',addressId:0,wardId :0  }

        let dataSelect = [],
            IsActive = 0,
            isdisabled = false;
        dataSelect.push(FirstData);
        setValueS(FirstData);
        

        list.length > 0 && list.forEach((element, index) => {
            isdisabled = false;
            if(element.PostOfficeID === isdisabledID ){isdisabled = true}
            dataSelect.push({ 
                value: element.PostOfficeID, 
                label: element.POName,
                addressId:element.AddressId,
                wardId :element.WardId,
                FullAddress:element.FullAddress, 
                Lat: element.Lat, 
                Lng: element.Lng,
                POCode: element.POCode,
                isdisabled: isdisabled,
                TimeDown: element.TimeDown, 
                TonTimeDown: element.TonTimeDown || 30, 
                TimeSlotFrom: element.TimeSlotFrom, 
                TimeSlotTo: element.TimeSlotTo,
                AddressId: element.AddressId,
             });
            if (element.PostOfficeID === onPost)
                IsActive = 1
        });

        setData(dataSelect)

        if (IsActive === 1 && list.length > 0) {
            let ListPost = list.filter(a => a.PostOfficeID === onPost)[0];
            setValueS({ 
                value: ListPost.PostOfficeID, 
                label: ListPost.POName,
                wardId :ListPost.WardId,
                FullAddress:ListPost.FullAddress, 
                Lat: ListPost.Lat, 
                Lng: ListPost.Lng,
                POCode: ListPost.POCode,
                TimeDown: ListPost.TimeDown, 
                TonTimeDown: ListPost.TonTimeDown  || 30, 
                TimeSlotFrom: ListPost.TimeSlotFrom, 
                TimeSlotTo: ListPost.TimeSlotTo,
                AddressId: ListPost.AddressId,
            });
            //onSelected(FirstData);
        }

    }

    useEffect(() => {
        CPN_spPostOffice_ByAreaId()
    }, [AreaId,isdisabledID]);

    useEffect(() => {
        if (onPost != 0)
            setValueS(data.filter(a => a.value === onPost))
        else {
            !isNewStyle 
            ? setValueS({ value: 0, label: 'Vui lòng chọn' })
            :  setValueS({ value: 0, label: 'Chọn bưu cục' })
        }
    }, [onPost]);
    
    return (
        <Select className="SelectMeno"
            id="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
            ref={ref}
            isMulti={isMulti}
            isDisabled={isDisabled}
            isOptionDisabled={(option) => option.isdisabled} // disable an option
        />
    )
}
);

export const SelectPost = React.memo(SelectPostComp)