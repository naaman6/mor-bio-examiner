# mor-bio-examiner

> בוחן מיוני רפואה — שאלון אישי-ביוגרפי (מו"ר / מרק"ם / מר"ב)
> AI Skill for Israeli medical school biographical questionnaire preparation.

[![npm version](https://img.shields.io/npm/v/mor-bio-examiner.svg)](https://www.npmjs.com/package/mor-bio-examiner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## מה זה

סקיל AI מבוסס-ראיות לבחינת תשובות לשאלון האישי-ביוגרפי בבחינות המיון לרפואה (מו"ר, מרק"ם, מר"ב). הסקיל מספק:

- **2 כובעי בחינה:** בוחן מאל"ו מנוסה + פסיכולוג ארגוני
- **פורמט 2025/2026 מאומת:** 7 סעיפים לתפקידים, מבנה גמיש לשאלות מקרה
- **7 שכבות איכות** לשאלות מקרה + Coherence Test
- **דגלים אדומים** מבוססי מחקר (Roulin, Levashina, Eurich, Dweck)
- **בנק שאלות היסטוריות + סיפורי מועמד**
- **21 תכונות רפואיות** + AAMC Core Competencies

## התקנה מהירה

```bash
# התקנה אוטומטית לכל סוכן שמזוהה בפרויקט
npx mor-bio-examiner install

# התקנה ספציפית
npx mor-bio-examiner install -a claude-code
npx mor-bio-examiner install -a cursor --global
npx mor-bio-examiner install -a perplexity
```

## סוכנים נתמכים

| סוכן | תיקייה |
|---|---|
| Claude Code / Desktop | `.claude/skills/` |
| Cursor | `.cursor/skills/` |
| Codex | `.codex/skills/` |
| OpenCode | `.opencode/skills/` |
| Perplexity Computer | `skills/user/` |

## פקודות

```bash
npx mor-bio-examiner install            # התקנה (אוטומטי או -a <agent>)
npx mor-bio-examiner info               # פירוט קבצי הסקיל
npx mor-bio-examiner list               # רשימת סוכנים נתמכים
npx mor-bio-examiner help               # עזרה
```

## דוגמת שימוש (אחרי התקנה)

פתח את הסוכן שלך ושאל:
- "תבחן את התשובה שלי לשאלה הביוגרפית"
- "תרגל אותי בשאלת מקרה"
- "תעזור לי לנסח תשובה לסעיף ב של תפקיד המורה שלי"

הסקיל יופעל אוטומטית על מילות מפתח: ביוגרפי, מיונים, רפואה, מור, מרקם, מרב, שאלון אישי.

## רקע מחקרי

הסקיל בנוי על מחקר peer-reviewed עדכני (2018-2026) כולל:
- Roulin (2015, 2021) — Impression Management
- Eurich (2018) — Self-Awareness
- Dweck — Mindset
- Mayer-Salovey — Emotional Intelligence
- AAMC Core Competencies (2023)
- ולידציה מול 11 דוגמאות 230+ של פייר ועמיתים

## רישיון

MIT © naaman6

## תרומה / Issues

[GitHub Issues](https://github.com/naaman6/mor-bio-examiner/issues)
