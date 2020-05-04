module.exports = {
    server: {
        start:          'Máy chủ khởi động thành công',
        stop:           'Máy chủ hiện đang tạm dừng',
        maintenance:    'Máy chủ đang bảo trì',
        update:         'Máy chủ đã được nâng cấp'
    },
    database: {
        connect: {
            wait:       'Đang kết nối với cơ sở dữ liệu',
            true:       'Kết nối cơ sở dữ liệu thành công',
            false:      'Kết nối cơ sở dữ liệu thất bại'
        },
        get: {
            true:       'Lấy dữ liệu thành công',
            false:      'Lấy dữ liệu thất bại',
            null:       'Dữ liệu không tồn tại'
        },
        update: {
            true:       'Thay đổi dữ liệu thành công',
            false:      'THay đổi dữ liệu thất bại'
        },
        delete: {
            true:       'Xóa dữ liệu thành công',
            false:      'Xóa dữ liệu thất bại'
        }
    },
    build: {
        start: '>> Thiết lập',
        end: '>> Thiết lập hoàn tất',
        error: '>> Thiết lập lỗi',
        model: {
            true:       'Tải danh sách Model thành công',
            false:      'Định dạng danh sách Model sai cú pháp',
            dupe:       'Xảy ra lỗi lặp lại tên model',
        },
        api: {
            true:       'Tải danh sách API thành công',
            false:      'Định dạng danh sách API sai cú pháp',
            dupe:       'Xảy ra lỗi lặp lại tên API',
        },
        socket: {
            true:       'Tải danh sách Socket thành công',
            false:      'Định dạng danh sách Socket sai cú pháp',
            dupe:       'Xảy ra lỗi lặp lại tên socket',
        }
    },
    user: {
        online: 'Đã đăng nhập tài khoản',
        offline: 'Chưa đăng nhập tài khoản'
    }
}