const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Qna",
  tableName: "QNA_TB", 
  columns: {
    QNA_IDX: { 
      primary: true, 
      type: "number", 
      generated: "increment" 
    },
    CATEGORY: { 
      type: "varchar2", 
      length: 50, 
      nullable: false 
    },
    QUESTION: { 
      type: "varchar2", 
      length: 1000, 
      nullable: false 
    },
    ANSWER: { 
      type: "clob", 
      nullable: false 
    },
    SORT_ORDER: { 
      type: "number", 
      default: 0 
    },
    REG_DATE: { 
      type: "date", 
      createDate: true 
    },
  },
});