import { exec } from "child_process";

exec("docker-compose --env-file ./../.env.test down -v", (e, stdout, stderr) => {
  if (e) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
      console.log(`${stderr}`);
      return;
  }
  console.log(`stdout: ${stdout}`);
})