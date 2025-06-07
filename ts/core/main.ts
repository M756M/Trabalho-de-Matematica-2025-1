import settings from "./config.js";
import { Route } from "./routing.js";
import { parseArray } from "./parsing.js";

Route.use(settings);

const systemForm = document.getElementById("system") as HTMLFormElement;
const systemSolveBtn = document.getElementById("systemSolve") as HTMLButtonElement;

systemForm.addEventListener("submit", (ev) => ev.preventDefault());

systemSolveBtn.addEventListener("click", async () => {
    const fields = document.getElementsByClassName("systemField") as HTMLCollectionOf<HTMLInputElement>;
    const processRoute = Route.fromIterator("process", fields);

    const systemSolution = await processRoute.get((res) => parseArray(res, Number));

    const solutionDiv = document.createElement("div");
    solutionDiv.classList.add("systemSolution");

    document.body.appendChild(solutionDiv);
    systemSolution.forEach((value, index) => solutionDiv.innerHTML += `<p>i${index + 1} = ${value} Amp</p>\n`)
})