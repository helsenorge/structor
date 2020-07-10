/* tslint:disable */
import * as Primitive from '../../xml-primitives';
import * as xml from '../XML/1998/namespace';

// Source files:
// http://hl7.org/fhir/fhir-xhtml.xsd

interface BaseType {
    _exists: boolean;
    _namespace: string;
}
interface _AbbrType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface AbbrType extends _AbbrType {
    constructor: { new (): AbbrType };
}

/** a elements use "Inline" excluding a */
interface _acontent extends BaseType {
    /** abbreviation */
    abbr?: AbbrType[];
    /** acronym */
    acronym?: AcronymType[];
    /** bold font */
    b?: BType[];
    /** I18N BiDi over-ride */
    bdo?: BdoType[];
    /** bigger font */
    big?: BigType[];
    /** forced line break */
    br?: BrType[];
    /** citation */
    cite?: CiteType[];
    /** program code */
    code?: CodeType[];
    /** definitional */
    dfn?: DfnType[];
    /** emphasis */
    em?: EmType[];
    /** italic font */
    i?: IType[];
    img?: ImgType[];
    /** something user would type */
    kbd?: KbdType[];
    map?: MapType[];
    /** inlined quote */
    q?: QType[];
    /** sample */
    samp?: SampType[];
    /** smaller font */
    small?: SmallType[];
    /** generic language/style container */
    span?: SpanType[];
    /** strong emphasis */
    strong?: StrongType[];
    /** subscript */
    sub?: SubType[];
    /** superscript */
    sup?: SupType[];
    /** fixed pitch font */
    tt?: TtType[];
    /** variable */
    var?: VarType[];
}
export interface acontent extends _acontent {
    constructor: { new (): acontent };
}
export var acontent: { new (): acontent };

interface _AcronymType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface AcronymType extends _AcronymType {
    constructor: { new (): AcronymType };
}

interface _AddressType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface AddressType extends _AddressType {
    constructor: { new (): AddressType };
}

type AlignType = 'left' | 'center' | 'right' | 'justify' | 'char';
interface _AlignType extends Primitive._string {
    content: AlignType;
}

interface _AreaType extends BaseType {
    accesskey: string;
    alt: string;
    class: string;
    coords: string;
    dir: DirType;
    href: string;
    id: string;
    lang: string[];
    nohref: AreaTypeNohrefType;
    shape: Shape;
    style: string;
    tabindex: number;
    title: string;
}
interface AreaType extends _AreaType {
    constructor: { new (): AreaType };
}

type AreaTypeNohrefType = 'nohref';
interface _AreaTypeNohrefType extends Primitive._string {
    content: AreaTypeNohrefType;
}

interface _AType extends _acontent {
    accesskey: string;
    charset: string;
    class: string;
    coords: string;
    dir: DirType;
    href: string;
    hreflang: string;
    id: string;
    lang: string[];
    name: string;
    rel: string;
    rev: string;
    shape: Shape;
    style: string;
    tabindex: number;
    title: string;
    type: string;
}
interface AType extends _AType {
    constructor: { new (): AType };
}

interface _BdoType extends _Inline {
    class: string;
    dir: BdoTypeDirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface BdoType extends _BdoType {
    constructor: { new (): BdoType };
}

type BdoTypeDirType = 'ltr' | 'rtl';
interface _BdoTypeDirType extends Primitive._string {
    content: BdoTypeDirType;
}

interface _BigType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface BigType extends _BigType {
    constructor: { new (): BigType };
}

interface _Block extends BaseType {
    /** information on author */
    address?: AddressType[];
    blockquote?: BlockquoteType[];
    /** generic language/style container */
    div?: DivType[];
    dl?: DlType[];
    h1?: H1Type[];
    h2?: H2Type[];
    h3?: H3Type[];
    h4?: H4Type[];
    h5?: H5Type[];
    h6?: H6Type[];
    hr?: HrType[];
    /** Ordered (numbered) list */
    ol?: OlType[];
    p?: PType[];
    /** content is "Inline" excluding "img|object|big|small|sub|sup" */
    pre?: PreType[];
    table?: TableType[];
    /** Unordered list */
    ul?: UlType[];
}
export interface Block extends _Block {
    constructor: { new (): Block };
}
export var Block: { new (): Block };

interface _BlockquoteType extends _Block {
    cite: string;
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface BlockquoteType extends _BlockquoteType {
    constructor: { new (): BlockquoteType };
}

interface _BrType extends BaseType {
    class: string;
    id: string;
    style: string;
    title: string;
}
interface BrType extends _BrType {
    constructor: { new (): BrType };
}

interface _BType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface BType extends _BType {
    constructor: { new (): BType };
}

interface _CaptionType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface CaptionType extends _CaptionType {
    constructor: { new (): CaptionType };
}

/** a single character, as per section 2.2 of [XML] */
export type Character = string;
type _Character = Primitive._string;

/** a character encoding, as per [RFC2045] */
export type Charset = string;
type _Charset = Primitive._string;

/** a space separated list of character encodings, as per [RFC2045] */
export type Charsets = string;
type _Charsets = Primitive._string;

interface _CiteType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface CiteType extends _CiteType {
    constructor: { new (): CiteType };
}

interface _CodeType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface CodeType extends _CodeType {
    constructor: { new (): CodeType };
}

interface _ColgroupType extends BaseType {
    align: AlignType;
    char: string;
    charoff: string;
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    span: number;
    style: string;
    title: string;
    valign: ValignType;
    width: string;
    /** col elements define the alignment properties for cells in
     * one or more columns.
     *
     * The width attribute specifies the width of the columns, e.g.
     *
     * width=64        width in screen pixels
     * width=0.5*      relative width of 0.5
     *
     * The span attribute causes the attributes of one
     * col element to apply to more than one column. */
    col?: ColType[];
}
interface ColgroupType extends _ColgroupType {
    constructor: { new (): ColgroupType };
}

interface _ColType extends BaseType {
    align: AlignType;
    char: string;
    charoff: string;
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    span: number;
    style: string;
    title: string;
    valign: ValignType;
    width: string;
}
interface ColType extends _ColType {
    constructor: { new (): ColType };
}

/** media type, as per [RFC2045] */
export type ContentType = string;
type _ContentType = Primitive._string;

/** comma-separated list of media types, as per [RFC2045] */
export type ContentTypes = string;
type _ContentTypes = Primitive._string;

/** comma separated list of lengths */
export type Coords = string;
type _Coords = Primitive._string;

/** date and time information. ISO date format */
export type Datetime = Date;
type _Datetime = Primitive._Date;

interface _DdType extends _Flow {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface DdType extends _DdType {
    constructor: { new (): DdType };
}

interface _DfnType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface DfnType extends _DfnType {
    constructor: { new (): DfnType };
}

type DirType = 'ltr' | 'rtl';
interface _DirType extends Primitive._string {
    content: DirType;
}

interface _DivType extends _Flow {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
export interface DivType extends _DivType {
    constructor: { new (): DivType };
}
export var DivType: { new (): DivType };

interface _DlType extends BaseType {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
    dd: DdType[];
    dt: DtType[];
}
interface DlType extends _DlType {
    constructor: { new (): DlType };
}

interface _DtType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface DtType extends _DtType {
    constructor: { new (): DtType };
}

interface _EmType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface EmType extends _EmType {
    constructor: { new (): EmType };
}

/** "Flow" mixes block and inline and is used for list items etc. */
interface _Flow extends BaseType {
    /** content is "Inline" except that anchors shouldn't be nested */
    a?: AType[];
    /** abbreviation */
    abbr?: AbbrType[];
    /** acronym */
    acronym?: AcronymType[];
    /** information on author */
    address?: AddressType[];
    /** bold font */
    b?: BType[];
    /** I18N BiDi over-ride */
    bdo?: BdoType[];
    /** bigger font */
    big?: BigType[];
    blockquote?: BlockquoteType[];
    /** forced line break */
    br?: BrType[];
    /** citation */
    cite?: CiteType[];
    /** program code */
    code?: CodeType[];
    /** definitional */
    dfn?: DfnType[];
    /** generic language/style container */
    div?: DivType[];
    dl?: DlType[];
    /** emphasis */
    em?: EmType[];
    h1?: H1Type[];
    h2?: H2Type[];
    h3?: H3Type[];
    h4?: H4Type[];
    h5?: H5Type[];
    h6?: H6Type[];
    hr?: HrType[];
    /** italic font */
    i?: IType[];
    img?: ImgType[];
    /** something user would type */
    kbd?: KbdType[];
    map?: MapType[];
    /** Ordered (numbered) list */
    ol?: OlType[];
    p?: PType[];
    /** content is "Inline" excluding "img|object|big|small|sub|sup" */
    pre?: PreType[];
    /** inlined quote */
    q?: QType[];
    /** sample */
    samp?: SampType[];
    /** smaller font */
    small?: SmallType[];
    /** generic language/style container */
    span?: SpanType[];
    /** strong emphasis */
    strong?: StrongType[];
    /** subscript */
    sub?: SubType[];
    /** superscript */
    sup?: SupType[];
    table?: TableType[];
    /** fixed pitch font */
    tt?: TtType[];
    /** Unordered list */
    ul?: UlType[];
    /** variable */
    var?: VarType[];
}
export interface Flow extends _Flow {
    constructor: { new (): Flow };
}
export var Flow: { new (): Flow };

interface _H1Type extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface H1Type extends _H1Type {
    constructor: { new (): H1Type };
}

interface _H2Type extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface H2Type extends _H2Type {
    constructor: { new (): H2Type };
}

interface _H3Type extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface H3Type extends _H3Type {
    constructor: { new (): H3Type };
}

interface _H4Type extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface H4Type extends _H4Type {
    constructor: { new (): H4Type };
}

interface _H5Type extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface H5Type extends _H5Type {
    constructor: { new (): H5Type };
}

interface _H6Type extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface H6Type extends _H6Type {
    constructor: { new (): H6Type };
}

interface _HrType extends BaseType {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface HrType extends _HrType {
    constructor: { new (): HrType };
}

interface _ImgType extends BaseType {
    alt: string;
    class: string;
    dir: DirType;
    height: string;
    id: string;
    ismap: ImgTypeIsmapType;
    lang: string[];
    longdesc: string;
    src: string;
    style: string;
    title: string;
    /** usemap points to a map element which may be in this document
     * or an external document, although the latter is not widely supported */
    usemap: string;
    width: string;
}
interface ImgType extends _ImgType {
    constructor: { new (): ImgType };
}

type ImgTypeIsmapType = 'ismap';
interface _ImgTypeIsmapType extends Primitive._string {
    content: ImgTypeIsmapType;
}

/** "Inline" covers inline or "text-level" elements */
interface _Inline extends BaseType {
    /** content is "Inline" except that anchors shouldn't be nested */
    a?: AType[];
    /** abbreviation */
    abbr?: AbbrType[];
    /** acronym */
    acronym?: AcronymType[];
    /** bold font */
    b?: BType[];
    /** I18N BiDi over-ride */
    bdo?: BdoType[];
    /** bigger font */
    big?: BigType[];
    /** forced line break */
    br?: BrType[];
    /** citation */
    cite?: CiteType[];
    /** program code */
    code?: CodeType[];
    /** definitional */
    dfn?: DfnType[];
    /** emphasis */
    em?: EmType[];
    /** italic font */
    i?: IType[];
    img?: ImgType[];
    /** something user would type */
    kbd?: KbdType[];
    map?: MapType[];
    /** inlined quote */
    q?: QType[];
    /** sample */
    samp?: SampType[];
    /** smaller font */
    small?: SmallType[];
    /** generic language/style container */
    span?: SpanType[];
    /** strong emphasis */
    strong?: StrongType[];
    /** subscript */
    sub?: SubType[];
    /** superscript */
    sup?: SupType[];
    /** fixed pitch font */
    tt?: TtType[];
    /** variable */
    var?: VarType[];
}
export interface Inline extends _Inline {
    constructor: { new (): Inline };
}
export var Inline: { new (): Inline };

interface _IType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface IType extends _IType {
    constructor: { new (): IType };
}

interface _KbdType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface KbdType extends _KbdType {
    constructor: { new (): KbdType };
}

/** a language code, as per [RFC3066] */
export type LanguageCode = string;
type _LanguageCode = Primitive._string;

/** nn for pixels or nn% for percentage length */
export type Length = string;
type _Length = Primitive._string;

/** space-separated list of link types */
export type LinkTypes = string;
type _LinkTypes = Primitive._string;

interface _LiType extends _Flow {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface LiType extends _LiType {
    constructor: { new (): LiType };
}

interface _MapType extends BaseType {
    dir: DirType;
    id: string;
    lang: string[];
    name: string;
    style: string;
    title: string;
    /** information on author */
    address: AddressType[];
    area: AreaType[];
    blockquote: BlockquoteType[];
    /** generic language/style container */
    div: DivType[];
    dl: DlType[];
    h1: H1Type[];
    h2: H2Type[];
    h3: H3Type[];
    h4: H4Type[];
    h5: H5Type[];
    h6: H6Type[];
    hr: HrType[];
    /** Ordered (numbered) list */
    ol: OlType[];
    p: PType[];
    /** content is "Inline" excluding "img|object|big|small|sub|sup" */
    pre: PreType[];
    table: TableType[];
    /** Unordered list */
    ul: UlType[];
}
interface MapType extends _MapType {
    constructor: { new (): MapType };
}

/** single or comma-separated list of media descriptors */
export type MediaDesc = string;
type _MediaDesc = Primitive._string;

/** pixel, percentage, or relative */
export type MultiLength = string;
type _MultiLength = Primitive._string;

/** one or more digits */
export type Number = number;
type _Number = Primitive._number;

interface _OlType extends BaseType {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
    /** list item */
    li: LiType[];
}
interface OlType extends _OlType {
    constructor: { new (): OlType };
}

/** integer representing length in pixels */
export type Pixels = number;
type _Pixels = Primitive._number;

/** pre uses "Inline" excluding big, small, sup or sup */
interface _precontent extends BaseType {
    /** content is "Inline" except that anchors shouldn't be nested */
    a?: AType[];
    /** abbreviation */
    abbr?: AbbrType[];
    /** acronym */
    acronym?: AcronymType[];
    /** bold font */
    b?: BType[];
    /** I18N BiDi over-ride */
    bdo?: BdoType[];
    /** bigger font */
    big?: BigType[];
    /** forced line break */
    br?: BrType[];
    /** citation */
    cite?: CiteType[];
    /** program code */
    code?: CodeType[];
    /** definitional */
    dfn?: DfnType[];
    /** emphasis */
    em?: EmType[];
    /** italic font */
    i?: IType[];
    /** something user would type */
    kbd?: KbdType[];
    map?: MapType[];
    /** inlined quote */
    q?: QType[];
    /** sample */
    samp?: SampType[];
    /** smaller font */
    small?: SmallType[];
    /** generic language/style container */
    span?: SpanType[];
    /** strong emphasis */
    strong?: StrongType[];
    /** subscript */
    sub?: SubType[];
    /** superscript */
    sup?: SupType[];
    /** fixed pitch font */
    tt?: TtType[];
    /** variable */
    var?: VarType[];
}
export interface precontent extends _precontent {
    constructor: { new (): precontent };
}
export var precontent: { new (): precontent };

interface _PreType extends _precontent {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    /** space (as an attribute name)
     *
     * denotes an attribute whose
     * value is a keyword indicating what whitespace processing
     * discipline is intended for the content of the element; its
     * value is inherited.  This name is reserved by virtue of its
     * definition in the XML specification. */
    space: xml.SpaceType;
    style: string;
    title: string;
}
interface PreType extends _PreType {
    constructor: { new (): PreType };
}

interface _PType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface PType extends _PType {
    constructor: { new (): PType };
}

interface _QType extends _Inline {
    $cite: string;
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface QType extends _QType {
    constructor: { new (): QType };
}

interface _SampType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface SampType extends _SampType {
    constructor: { new (): SampType };
}

/** Scope is simpler than headers attribute for common tables */
export type Scope = 'row' | 'col' | 'rowgroup' | 'colgroup';
interface _Scope extends Primitive._string {
    content: Scope;
}

/** script expression */
export type Script = string;
type _Script = Primitive._string;

export type Shape = 'rect' | 'circle' | 'poly' | 'default';
interface _Shape extends Primitive._string {
    content: Shape;
}

interface _SmallType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface SmallType extends _SmallType {
    constructor: { new (): SmallType };
}

interface _SpanType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface SpanType extends _SpanType {
    constructor: { new (): SpanType };
}

interface _StrongType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface StrongType extends _StrongType {
    constructor: { new (): StrongType };
}

/** style sheet data */
export type StyleSheet = string;
type _StyleSheet = Primitive._string;

interface _SubType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface SubType extends _SubType {
    constructor: { new (): SubType };
}

interface _SupType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface SupType extends _SupType {
    constructor: { new (): SupType };
}

/** tabindex attribute specifies the position of the current element
 * in the tabbing order for the current document. This value must be
 * a number between 0 and 32767. User agents should ignore leading zeros. */
export type tabindexNumber = number;
type _tabindexNumber = _Number;

interface _TableType extends BaseType {
    border: number;
    cellpadding: string;
    cellspacing: string;
    class: string;
    dir: DirType;
    frame: TFrame;
    id: string;
    lang: string[];
    rules: TRules;
    style: string;
    summary: string;
    title: string;
    width: string;
    caption?: CaptionType;
    /** col elements define the alignment properties for cells in
     * one or more columns.
     *
     * The width attribute specifies the width of the columns, e.g.
     *
     * width=64        width in screen pixels
     * width=0.5*      relative width of 0.5
     *
     * The span attribute causes the attributes of one
     * col element to apply to more than one column. */
    col?: ColType[];
    /** colgroup groups a set of col elements. It allows you to group
     * several semantically related columns together. */
    colgroup?: ColgroupType[];
    tbody: TbodyType[];
    tfoot?: TfootType;
    thead?: TheadType;
    tr: TrType[];
}
interface TableType extends _TableType {
    constructor: { new (): TableType };
}

interface _TbodyType extends BaseType {
    align: AlignType;
    char: string;
    charoff: string;
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
    valign: ValignType;
    tr: TrType[];
}
interface TbodyType extends _TbodyType {
    constructor: { new (): TbodyType };
}

interface _TdType extends _Flow {
    $abbr: string;
    align: AlignType;
    char: string;
    charoff: string;
    class: string;
    colspan: number;
    dir: DirType;
    headers: string;
    id: string;
    lang: string[];
    rowspan: number;
    scope: Scope;
    style: string;
    title: string;
    valign: ValignType;
}
interface TdType extends _TdType {
    constructor: { new (): TdType };
}

/** used for titles etc. */
export type Text = string;
type _Text = Primitive._string;

interface _TfootType extends BaseType {
    align: AlignType;
    char: string;
    charoff: string;
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
    valign: ValignType;
    tr: TrType[];
}
interface TfootType extends _TfootType {
    constructor: { new (): TfootType };
}

/** The border attribute sets the thickness of the frame around the
 * table. The default units are screen pixels.
 *
 * The frame attribute specifies which parts of the frame around
 * the table should be rendered. The values are not the same as
 * CALS to avoid a name clash with the valign attribute. */
export type TFrame = 'void' | 'above' | 'below' | 'hsides' | 'lhs' | 'rhs' | 'vsides' | 'box' | 'border';
interface _TFrame extends Primitive._string {
    content: TFrame;
}

interface _TheadType extends BaseType {
    align: AlignType;
    char: string;
    charoff: string;
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
    valign: ValignType;
    tr: TrType[];
}
interface TheadType extends _TheadType {
    constructor: { new (): TheadType };
}

interface _ThType extends _Flow {
    $abbr: string;
    align: AlignType;
    char: string;
    charoff: string;
    class: string;
    colspan: number;
    dir: DirType;
    headers: string;
    id: string;
    lang: string[];
    rowspan: number;
    scope: Scope;
    style: string;
    title: string;
    valign: ValignType;
}
interface ThType extends _ThType {
    constructor: { new (): ThType };
}

interface _TrType extends BaseType {
    align: AlignType;
    char: string;
    charoff: string;
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
    valign: ValignType;
    td: TdType[];
    th: ThType[];
}
interface TrType extends _TrType {
    constructor: { new (): TrType };
}

/** The rules attribute defines which rules to draw between cells:
 *
 * If rules is absent then assume:
 * "none" if border is absent or border="0" otherwise "all" */
export type TRules = 'none' | 'groups' | 'rows' | 'cols' | 'all';
interface _TRules extends Primitive._string {
    content: TRules;
}

interface _TtType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface TtType extends _TtType {
    constructor: { new (): TtType };
}

interface _UlType extends BaseType {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
    /** list item */
    li: LiType[];
}
interface UlType extends _UlType {
    constructor: { new (): UlType };
}

/** a Uniform Resource Identifier, see [RFC2396] */
export type URI = string;
type _URI = Primitive._string;

/** a space separated list of Uniform Resource Identifiers */
export type UriList = string;
type _UriList = Primitive._string;

type ValignType = 'top' | 'middle' | 'bottom' | 'baseline';
interface _ValignType extends Primitive._string {
    content: ValignType;
}

interface _VarType extends _Inline {
    class: string;
    dir: DirType;
    id: string;
    lang: string[];
    style: string;
    title: string;
}
interface VarType extends _VarType {
    constructor: { new (): VarType };
}

export interface document extends BaseType {
    /** content is "Inline" except that anchors shouldn't be nested */
    a: AType;
    /** abbreviation */
    abbr: AbbrType;
    /** acronym */
    acronym: AcronymType;
    /** information on author */
    address: AddressType;
    area: AreaType;
    /** bold font */
    b: BType;
    /** I18N BiDi over-ride */
    bdo: BdoType;
    /** bigger font */
    big: BigType;
    blockquote: BlockquoteType;
    /** forced line break */
    br: BrType;
    caption: CaptionType;
    /** citation */
    cite: CiteType;
    /** program code */
    code: CodeType;
    /** col elements define the alignment properties for cells in
     * one or more columns.
     *
     * The width attribute specifies the width of the columns, e.g.
     *
     * width=64        width in screen pixels
     * width=0.5*      relative width of 0.5
     *
     * The span attribute causes the attributes of one
     * col element to apply to more than one column. */
    col: ColType;
    /** colgroup groups a set of col elements. It allows you to group
     * several semantically related columns together. */
    colgroup: ColgroupType;
    dd: DdType;
    /** definitional */
    dfn: DfnType;
    /** generic language/style container */
    div: DivType;
    dl: DlType;
    dt: DtType;
    /** emphasis */
    em: EmType;
    h1: H1Type;
    h2: H2Type;
    h3: H3Type;
    h4: H4Type;
    h5: H5Type;
    h6: H6Type;
    hr: HrType;
    /** italic font */
    i: IType;
    img: ImgType;
    /** something user would type */
    kbd: KbdType;
    /** list item */
    li: LiType;
    map: MapType;
    /** Ordered (numbered) list */
    ol: OlType;
    p: PType;
    /** content is "Inline" excluding "img|object|big|small|sub|sup" */
    pre: PreType;
    /** inlined quote */
    q: QType;
    /** sample */
    samp: SampType;
    /** smaller font */
    small: SmallType;
    /** generic language/style container */
    span: SpanType;
    /** strong emphasis */
    strong: StrongType;
    /** subscript */
    sub: SubType;
    /** superscript */
    sup: SupType;
    table: TableType;
    tbody: TbodyType;
    td: TdType;
    tfoot: TfootType;
    th: ThType;
    thead: TheadType;
    tr: TrType;
    /** fixed pitch font */
    tt: TtType;
    /** Unordered list */
    ul: UlType;
    /** variable */
    var: VarType;
}
export var document: document;
