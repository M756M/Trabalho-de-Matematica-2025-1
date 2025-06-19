type SystemValues = {
  voltageA: number;
  voltageB: number;
  resistance1: number;
  resistance2: number;
  resistance3: number;
  resistance4: number;
  resistance5: number;
};

type SystemSolution = {
    current1: number;
    current2: number;
    current3: number;
};

export async function solveSystem(values: SystemValues): Promise<SystemSolution>{
    const reqData = []

    for(const [name, value] of Object.entries(values)) reqData.push(`${name}=${value}`);

    const fetchData = await fetch("http://127.0.0.1:8080/?" + reqData.join("&"));
    const rawSystemRes = await (await fetchData.blob()).text();

    const systemRes = rawSystemRes.replace(/(\[|\])/g, "").split(/, ?/).map((value) => Number(value));

    return { current1: systemRes[0], current2: systemRes[1], current3: systemRes[2] };
};

export function clean(div: HTMLElement){
  div.innerHTML = "";

  return div;
};

export async function main(){
  const answer = document.getElementById("answer")!;

  const vA = Number.parseFloat((document.getElementById("voltageA") as HTMLInputElement).value);
  const vB = Number.parseFloat((document.getElementById("voltageB") as HTMLInputElement).value);
  const r1 = Number.parseFloat((document.getElementById("resistance1") as HTMLInputElement).value);
  const r2 = Number.parseFloat((document.getElementById("resistance2") as HTMLInputElement).value);
  const r3 = Number.parseFloat((document.getElementById("resistance3") as HTMLInputElement).value);
  const r4 = Number.parseFloat((document.getElementById("resistance4") as HTMLInputElement).value);
  const r5 = Number.parseFloat((document.getElementById("resistance5") as HTMLInputElement).value);

  const res = await solveSystem({
    voltageA: vA,
    voltageB: vB,
    resistance1: r1,
    resistance2: r2,
    resistance3: r3,
    resistance4: r4,
    resistance5: r5
  });
  
  clean(answer);
  for(const [i, current] of Object.entries(res)){
    const p = document.createElement("p");
    p.innerText = `${i.replace("current", "amperagem")} ${current} A`;

    answer.appendChild(p);
  };

  return;
};

document.getElementById("submit")!.addEventListener("click", async () => await main());