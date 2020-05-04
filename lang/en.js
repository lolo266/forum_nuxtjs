module.exports = {
    server: {
        start:          'Server started successfully',
        stop:           'Server is currently paused',
        maintenance:    'Server is under maintenance',
        update:         'Server have update'
    },
    database: {
        connect: {
            true:       'Database connection successful',
            false:      'Database connection failed'
        },
        get: {
            true:       'Get data successfully',
            false:      'Get data failed',
            null:       'Data does not exist'
        },
        update: {
            true:       'Data change successful',
            false:      'Data change failed'
        },
        delete: {
            true:       'Data deleted successfully',
            false:      'Data deletion failed'
        }
    },
    build: {
        start: '>> Build Start',
        end: '>> Build End',
        error: '>> Build Error',
        model: {
            true:       'Load list Model successful',
            false:      'List Model is not a Array',
            dupe:       'Reduplicate Model name - ',
        },
        api: {
            true:       'Load list API successful',
            false:      'List API is not a Array',
            dupe:       'Reduplicate API name - ',
        },
        socket: {
            true:       'Load list Socket successful',
            false:      'List Socket is not a Array',
            dupe:       'Reduplicate Socket name - ',
        }
    },
}