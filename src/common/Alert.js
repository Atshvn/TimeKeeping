import Swal from 'sweetalert2'

export const AlertSuccess = (title, message) => {
    Swal.fire(title, message, 'success')
}
export const AlertError = (title, message) => {
    Swal.fire(title, message, 'error')
}
export const AlertWarning = (title, message) => {
    Swal.fire(title, message, 'warning')
}
export const AlertInfo = (title, message) => {
    Swal.fire(title, message, 'info')
}
export const AlertQuestion = (title, message) => {
    Swal.fire(title, message, 'question')
}

export const AlertConfirm = (title, message, callback) => {
    Swal.fire({
        title: title,
        text: message,
        icon: 'info',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK, đã hiểu!'
    }).then((result) => {
        if (result.value) {
            callback()
        }
    })
}
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-outline-danger'
    },
   
  })
  

export const AlertConfirm2 = (title, message, textConfirm = 'OK', textCancer = 'Cancer', callback, callbackCancer) => {
    swalWithBootstrapButtons.fire({
        title: title,
        text: message,
        icon: 'success',
        confirmButtonColor: '#28a745',
        confirmButtonText: textConfirm,
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: textCancer,
    }).then((result) => {
        if (result.isConfirmed) {
            callback()
        }else{
            callbackCancer()
            
        }
    })
}

export const AlertDelete = (
    title= 'Are you sure?', 
    text = "You won't be able to revert this!", 
    confirmButtonText = 'Yes, delete it!',
    cancelButtonText = 'Cancer',
    callback = () => {},
     ) => {
    Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText,
        cancelButtonText,
      }).then((result) => {
        if (result.isConfirmed) {
            callback()
          Swal.fire(
            'Đã xóa',
            'Đã từ chối chấm công thành công',
            'success'
          )
         
        }
      })
}