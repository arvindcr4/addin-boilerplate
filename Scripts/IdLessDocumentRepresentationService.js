var u = Object.defineProperty;
var f = (c, h, a) => h in c ? u(c, h, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: a
}) : c[h] = a;
var g = (c, h, a) => f(c, typeof h != "symbol" ? h + "" : h, a);
import { D as y, c as p } from "./index-DZ0WvPMw.js";
class l extends y {
    constructor()
    {
        super(...arguments);
        g(this, "selectedParagraphTexts", new Set);
        g(this, "paragraphWordTexts", [])
    }
    static generateParagraphId(a, t, r, e)
    {
        const s = p.SHA256(t.text).toString(p.enc.Hex).slice(0, 8),
            i = r > 0 ? p.SHA256(e[r - 1].text).toString(p.enc.Hex).slice(0, 8) : "NONENONE",
            o = r < e.length - 1 ? p.SHA256(e[r + 1].text).toString(p.enc.Hex).slice(0, 8) : "NONENONE";
        return "PID-".concat(i, "-").concat(s, "-").concat(o, "-").concat(r)
    }
    async rememberSelectedParagraphs()
    {
        await Word.run(async a => {
            const t = a.document.getSelection();
            t.load("paragraphs"),
            await a.sync(),
            t.paragraphs.load("items"),
            await a.sync(),
            t.paragraphs.items.forEach(r => {
                var e,
                    s;
                (e = this.selectedParagraphTexts) != null && e.has(r.text) && this.trackEvent && this.trackEvent("Document representation fallback to text matching and duplicate paragraph texts"),
                (s = this.selectedParagraphTexts) == null || s.add(r.text)
            })
        })
    }
    async getParagraphStructure()
    {
        this.sections = await Word.run(async a => {
            const t = [],
                r = this.getDomParagraphs(),
                e = a.document.sections;
            e.load("body/paragraphs"),
            await a.sync(),
            await this.validateParagraphCount(e);
            const s = [];
            e.items.forEach(o => {
                s.push(...o.body.paragraphs.items)
            });
            let i = -1;
            return e.items.forEach((o, m) => {
                const n = {
                    index: m,
                    paragraphs: []
                };
                n.paragraphs = o.body.paragraphs.items.map(d => (i += 1, this.paragraphWordTexts.push(d.text), {
                    id: l.generateParagraphId(r[i], d, i, s)
                })),
                n.paragraphs.length > 0 && t.push(n)
            }), t
        }),
        this.paragraphsByID = {},
        this.flatParagraphs = this.sections.reduce((a, t) => (t.paragraphs.forEach(r => {
            this.paragraphsByID[r.id] = r
        }), a.push(...t.paragraphs), a), [])
    }
    async getComments()
    {
        this.commentMap = {},
        Office.context.requirements.isSetSupported("WordApi", "1.4") && await Word.run(async a => {
            const t = a.document.sections;
            t.load("body/paragraphs"),
            await a.sync();
            const r = [];
            t.items.forEach(e => {
                e.body.paragraphs.items.forEach(s => {
                    const i = s.getComments();
                    r.push(i),
                    i.load()
                })
            }),
            await a.sync(),
            r.forEach(e => e.items.forEach(s => s.replies.load())),
            await a.sync(),
            r.forEach((e, s) => {
                this.commentMap[this.flatParagraphs[s].id] = e.items
            })
        })
    }
    filterResultsBySelection()
    {
        this.commentMap = Object.fromEntries(Object.entries(this.commentMap).filter(([a]) => this.paragraphsByID[a] && this.isParagraphSelected(this.paragraphsByID[a]))),
        this.sections.forEach(a => {
            a.paragraphs = a.paragraphs.filter(t => this.isParagraphSelected(t))
        }),
        this.sections = this.sections.filter(a => a.paragraphs.length > 0)
    }
    isParagraphSelected(a)
    {
        const t = this.paragraphWordTexts[this.flatParagraphs.indexOf(a)];
        return this.selectedParagraphTexts.has(t)
    }
}
export { l as IdLessDocumentRepresentationService };
//# sourceMappingURL=IdLessDocumentRepresentationService-DYN0ir2L.js.map
