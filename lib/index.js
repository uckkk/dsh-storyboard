// dsh-storyboard — 分镜脚本：分镜术语 + 分镜模板（纯 Node 知识库）。
import { defineTool } from "@deepseek-ai/dsh-tools";

const name = "分镜脚本";
const inject = ["tools"];

const TERMS = [
  { id: "panel", name: "画格（Panel）", en: "Panel/Frame", desc: "分镜中的单个画面，代表一个镜头或关键瞬间，需标注编号。" },
  { id: "shot-number", name: "镜头号", en: "Shot Number", desc: "每个镜头的唯一编号（如 SC01），便于拍摄时对照与沟通。" },
  { id: "action", name: "动作说明", en: "Action", desc: "画面内发生了什么：角色动作、物体运动、镜头运动等。" },
  { id: "dialogue", name: "对白/台词", en: "Dialogue", desc: "该镜头内的台词或画外音，标注说话人与语气。" },
  { id: "camera-arrow", name: "运镜箭头", en: "Camera Arrow", desc: "在画格上画箭头表示镜头运动方向（推/拉/摇/移）。" },
  { id: "duration", name: "时长", en: "Duration", desc: "预估镜头持续秒数，控制节奏与总时长。" },
  { id: "transition", name: "转场", en: "Transition", desc: "镜头间的切换方式（硬切/淡入淡出/叠化/甩切）。" },
  { id: "sound", name: "声音备注", en: "Sound Notes", desc: "背景音乐、音效、环境音等听觉信息。" },
];

const TEMPLATE = [
  { field: "镜头号", example: "SC01" },
  { field: "景别", example: "中景 / 特写 / 远景" },
  { field: "运镜", example: "推近 / 摇 / 固定" },
  { field: "画面内容（动作）", example: "主角推门而入，环顾房间" },
  { field: "对白/台词", example: "“我回来了。”" },
  { field: "声音", example: "门轴吱呀声 + 轻音乐渐入" },
  { field: "时长", example: "3s" },
  { field: "转场", example: "硬切" },
];

async function apply(ctx, _config) {
  ctx.tools.register(defineTool({
    name: "list_storyboard_terms",
    description: "列出分镜脚本常用术语（画格/镜头号/动作说明/对白/运镜箭头/时长/转场/声音备注），含说明。",
    parameters: {},
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: {
          count: { type: "integer", required: true },
          terms: { type: "array", required: true, items: { type: "object", additionalProperties: false, properties: { id: { type: "string", required: true }, name: { type: "string", required: true }, en: { type: "string", required: true }, desc: { type: "string", required: true } } } },
        },
      },
      render: (_a, v) => [{ type: "text", text: v.terms.map((t) => `- ${t.name}（${t.en}）：${t.desc}`).join("\n") }],
    },
    execute: async () => ({ count: TERMS.length, terms: TERMS.map(({ id, name, en, desc }) => ({ id, name, en, desc })) }),
  }));

  ctx.tools.register(defineTool({
    name: "storyboard_template",
    description: "返回一个标准分镜脚本表格模板（每个镜头应填写的字段与示例），可直接套用。",
    parameters: {},
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: { template: { type: "array", required: true, items: { type: "object", additionalProperties: false, properties: { field: { type: "string", required: true }, example: { type: "string", required: true } } } } },
      },
      render: (_a, v) => [{ type: "text", text: "分镜脚本模板（每镜头一栏）：\n" + v.template.map((t) => `- ${t.field}：${t.example}`).join("\n") }],
    },
    execute: async () => ({ template: TEMPLATE.map((t) => ({ ...t })) }),
  }));
}

export { apply, inject, name };
