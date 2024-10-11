import { Resend } from "resend";
import { EmailTemplate } from "./email-template";
import fs from "fs";
const { execSync } = require("child_process");
const resend = new Resend("re_PMMfHgup_Midt3DARHoKsz6Th1SvMptiP");
let loc = `/Users/shelbernstein/hashirama/services/homelab-status-page/views/blog/university/email_case.html `;
let step_1 = "mailwind --input-html email.html --output-css style.css";
let step_2 =
  "mailwind --input-html email.html  --output-html email-inlined.html";
async function _() {
  const response = await fetch("http://localhost:1337/email");
  const html = await response.text();
  fs.writeFileSync("email.html", html);
  execSync(step_1);
  execSync(step_2);
  const emailHtml = fs.readFileSync("email-inlined.html", "utf8");

  let butt = `
  <div>
	https://robotics-journey.com
		<img height='500px' src='https://github.com/adnanwahab/hashirama/blob/main/services/homelab-status-page/static/images/blog/New%20Folder%20With%20Items/Screenshot%202024-09-12%20at%205.12.58%E2%80%AFAM.png?raw=true' height='500px'>
	<img height='500px' src='https://github.com/adnanwahab/hashirama/blob/main/services/homelab-status-page/static/images/blog/ezgif.com-optimize.gif?raw=true' height='500px'>


	<img height='500px' src='https://github.com/adnanwahab/hashirama/blob/main/services/homelab-status-page/static/images/blog/building.png?raw=true' height='500px'>

`;
  let subjects = [];
  function getRandomEmoji() {
    const emojis = ["😀", "😂", "🥲", "😎", "😍", "😡", "🤔", "😴", "🤯", "🥳"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  const randomEmoji = getRandomEmoji();
  console.log(`Random Emoji: ${randomEmoji}`);

  //console.log('email ',emailHtml)
  let domain = [
    "hashirama.bio",
    "michael-pollan.app",
    "taiyongrobotics.com",
    "leafstudio.design",
    "roboticsuniversity.dev",
  ][Math.floor(Math.random() * 5)];
  let cool = await resend.audiences.get("");
  console.log("cool ", cool.data);

  const { data, error } = await resend.emails.send({
    from: `eggnog@${domain[4]}`,
    //to: cool.data.id,
    // to: [
    //   //'mail@adnanwahab.com',
    //   ],
    subject:
      getRandomEmoji() +
      " " +
      subjects[Math.floor(Math.random() * subjects.length)],

    to: [
      // "farahwahab4@gmail.com",
      // "goutham.patnaik@gmail.com",
      // "tim@lyfcreative.com",
      "mail@adnanwahab.com",
    ],
    html: butt,
  });
  if (error) {
    return new Response(JSON.stringify({ error }));
  }
  console.log(data);
  return new Response(JSON.stringify({ data }));
}
_();
