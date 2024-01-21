const { CronJob } = require('cron');
const Sequelize = require('sequelize');
const Message = require('../models/message');
const Archive = require('../models/archive');

exports.job = new CronJob('0 0 * * *', //run everyday at midnight
    function () {
        archiveOldRecords();
    });

async function archiveOldRecords() {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recordsToArchive = await Message.findAll({
            where: {
                createdAt: {
                    [Sequelize.Op.lt]: oneWeekAgo,
                },
            },
        });

        await Archive.bulkCreate(recordsToArchive.map(row => row.toJSON()));

        await Message.destroy({
            where: {
                createdAt: {
                    [Sequelize.Op.lt]: oneWeekAgo,
                },
            },
        });
        
        console.log('Old records archived successfully.');
    }catch(err) {
        console.error('Error archiving old records:', err);
    }
}
