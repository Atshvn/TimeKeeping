import React from "react"

export const Expired = () => {


    return (
        <section class="page_404 content">
            <div class="container mt-5">
                <div class="row">
                    <div class="col-12">
                            <div class="four_zero_four_bg">
                                <h1 class="text-center text-muted">HẾT THỜI GIAN ĐĂNG NHẬP</h1>
                            </div>
                            <div class="contant_box_404 text-center">
                                <h3 class="h2">
                                   Vui lòng vào <code>erp-tms.vps.vn</code> chọn chức năng <b>Chấm công</b> để thực hiện đăng nhập lại!
                                </h3>
                            
                            <button 
                            className="btn btn-success mt-2 btn-out"
                            onClick={() => window.location.href = "https://erp-tms.vps.vn/home"}
                            >
                            Truy cập erp-tms.vps.vn
                            </button>
                                {/* <Link to={{pathname: 'https://erp-tms.vps.vn'}}  class="link_404">Truy cập erp-tms.vps.vn</Link> */}
                                
                            </div>
                        </div>
                </div>
            </div>
        </section>
    )
}