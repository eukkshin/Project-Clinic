'use strict';
const { EntitySchema } = require('typeorm');
module.exports = new EntitySchema({
  name: 'ReservationBlock',
  tableName: 'RESERVATION_BLOCK_TB',
  columns: {
    ID: { primary: true, type: Number, generated: 'increment' },
    BLOCK_DATE: { type: String, length: 10 },
    BLOCK_TIME: { type: String, length: 5 }, // 'ALL' = 날짜 전체
    REASON: { type: String, length: 200, nullable: true },
    CREATED_AT: { type: 'timestamp', createDate: true, default: () => 'CURRENT_TIMESTAMP' },
  },
});
