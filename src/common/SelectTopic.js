import { CloudFog } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { callApi } from '../services';

const SelectTopicComp = React.forwardRef(({
    onSelected = () => { },
    SubjectId = 0,
    IsLoad = -1,
    title='Chọn chủ đề'
    
},ref ) => {

    const [data, setData] = useState([])
    const [valueS, setValueS] = useState();
   
    useEffect(() => {
        Task_spChatbotSubjectAI_Select();
    }, [])

    const onSelecteItem = (item) => {

        onSelected(item)
        setValueS(item);
    }

  

    const Task_spChatbotSubjectAI_Select = async () => {

        let pr = {
            SubjectId: SubjectId
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbotSubjectAI_Select",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        console.log(list)
        const FirstData = { value: 0, label: title };
        let dataSelect = []
        setValueS(FirstData);
        dataSelect.push(FirstData);
       
        list.length > 0 && list.forEach((element, index) => {
            dataSelect.push({ 
                value: element.SubjectId, 
                label: element.SubjectContent,
               
            });

        });
        setData(dataSelect);
                   
    }
    useEffect(() => {
        if (SubjectId !== 0) {
            const val = [...data].filter(p => p.SubjectId === SubjectId);
            if (val.length > 0)
                setValueS(val[0]);
        }

    }, [SubjectId])
    
    return (
        <Select className="SelectMeno"
            id="SelectMeno"
            value={valueS}
            onChange={onSelecteItem}
            options={data}
            ref={ref}
                     
        />
    )
}
);

export const SelectTopic = React.memo(SelectTopicComp)