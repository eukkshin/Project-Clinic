import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("SITE_THEME_TB")
export class SiteThemes {
  @PrimaryGeneratedColumn({
    name: "THEME_IDX",
  })
  themeIdx;

  @Column({
    name: "PRIMARY_TONE",
    type: "varchar2",
    length: 50,
    default: "'BLUE'",
  })
  primaryTone;

  //Dark Mode
  @Column({
    name: "IS_DARK_MODE",
    type: "char",
    length: 1,
    default: "'N'",
  })
  isDarkMode;

  @Column({
    name: "UPDATED_AT",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt;
}
