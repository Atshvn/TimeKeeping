import React, { useEffect, useState } from "react";
import Select from "react-select";
import { callApi } from "../services";
const SelectOfficerListComp = React.forwardRef(
  (
    {
      onSelected = () => {},
      items = 0,
      PostId = 0,
      isMulti = false,
      types = 0,
      isDisabled = false,
      title = "Vui lòng chọn",
    },
    ref
  ) => {
    const [data, setData] = useState([]);
    const [valueS, setValueS] = useState();

    const onSelecteItem = (item) => {
      onSelected(item);
      setValueS(item);
    };

    const CPN_spOfficer_List = async () => {
      if (PostId === -1) {
        setValueS({ value: -1, label: title });
        setData([]);
        return;
      }
      const params = {
        Json: JSON.stringify({
          PostOfficeId: PostId,
          Types: types,
        }),
        func: "CPN_spOfficer_List",
        API_key: "netcoApikey2025",
      };
      const list = await callApi.Main(params);

      const FirstData = { value: 0, label: title };
      let dataSelect = [];
      setValueS(FirstData);
      dataSelect.push(FirstData);

      list.length > 0 &&
        list.forEach((element, index) => {
          dataSelect.push({
            value: element.OfficerID,
            label: element.OfficerName + " _ " + element.Email,
            name: element.OfficerName,
            email: element.Email,
            id: element.OfficerID,
          });
        });
      setData(dataSelect);
    };

    useEffect(() => {
      CPN_spOfficer_List();
    }, [PostId, types]);

    useEffect(() => {
      if (items != 0) {
        // if undefined this id in arr return value = 0
        let ar = data.find((a) => a.value == items);
        ar !== undefined
          ? setValueS(ar)
          : setValueS({ value: 0, label: title });
        ar !== undefined
          ? onSelecteItem(ar)
          : onSelecteItem({ value: 0, label: title });
      } else setValueS({ value: 0, label: title });
    }, [items]);

    return (
      <Select
        className="SelectMeno"
        value={valueS}
        onChange={onSelecteItem}
        options={data}
        ref={ref}
        isMulti={isMulti}
        isDisabled={isDisabled}
      />
    );
  }
);
export const SelectOfficerList = React.memo(SelectOfficerListComp);
