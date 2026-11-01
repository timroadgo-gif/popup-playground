import { sheet, head, actions } from "../ui/sheet.js?v=2ddd93318b9b";

// Figma «Работа» 497:3982. The bot link is not in the source, so both actions only close the sheet.
export default {
  id: "sell-telegram",
  kind: "sheet",
  title: "Будем на связи",
  hint: "Figma 497:3982 · две кнопки, Close",
  dismiss: { closeButton: true, swipe: true, backdrop: true, escape: true },
  render: ({ close }) => sheet(
    head({ heading: "Будем на связи", text: "Важно! Чтобы мы могли связаться с вами и согласовать стоимость лота, начните чат в Telegram с нашим ботом поддержки. Для этого откройте бот и нажмите кнопку «Старт»." }),
    actions({ primary: { label: "Перейти в Telegram и начать чат", onClick: close }, secondary: { label: "Я не пользуюсь телеграм", onClick: close } }),
  ),
};
