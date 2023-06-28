import React from "react"

export const LogTimeSheet = ({
    employee = {},
}) => {
    return (
        <li className='notification-content__item d-flex p-2 mt-2 '>
            <div className='notification-content_avatar pl-2'>
                <img src={`${employee.avatar}`} alt='avatar' className='avatar' />
            </div>
            <div className="flex-grow-1 d-flex flex-column align-items-start  ml-4">
                <div className='notification-content__item-title'>
                    <h5 className='m-0'> {employee._label}</h5>
                </div>
                <div className='notification-content__item-content'>
                    <p className='m-0'>{employee.text}</p>
                </div>

            </div>
            <div className='notification-content__item-content time'>
                <p className='m-0'>{employee.time}</p>
            </div>
        </li>
    )
}