module.exports = {
    db: {
        host: process.env.MONGODB_ADDON_HOST || '45.77.35.178',
        port: process.env.MONGODB_ADDON_PORT || '',
        username: process.env.MONGODB_ADDON_USER || 'tikitech',
        password: process.env.MONGODB_ADDON_PASSWORD || 'tikitech958632147',
        db_name: process.env.MONGODB_ADDON_DB || 'tikitech_admin'
    },
    baseURL: "http://thanhvien.applamdep.com",
    linkAPI: "/api/update-status?id="
}