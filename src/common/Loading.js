export const Loading = ({
    title = 'Đang xử lý, vui lòng chờ trong giây lát!',
}) => {
    return (
        <div class="loader position-absolute d-flex justify-content-center align-items-center flex-column">
            <div class="sp sp-wave"></div>
            <div className="text-muted font-weight-bold">{title}</div>
        </div>
    )
}