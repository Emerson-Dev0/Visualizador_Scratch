const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PROJECTS_FILE_PATTERN = /projetos.*\.js$/i;
const REMOTE_URL_PATTERN = /^https?:\/\//i;

async function findProjectFiles(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findProjectFiles(fullPath)));
      continue;
    }

    if (PROJECTS_FILE_PATTERN.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function loadProjectData(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: {} };

  try {
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: filePath });
    return sandbox.window.PROJETOS_DATA || null;
  } catch (error) {
    console.error('Falha ao executar', filePath, error.message);
    return null;
  }
}

function isBlank(value) {
  return !value || value.toString().trim() === '';
}

function buildChecks(project) {
  const checks = [
    { key: 'arquivo', val: project.arquivo, required: false },
    { key: 'thumb', val: project.thumb, required: true }
  ];

  if (project.galeria && project.galeria.foto) {
    checks.push({
      key: 'galeria.foto',
      val: project.galeria.foto,
      required: true
    });
  }

  if (project.galeria && Array.isArray(project.galeria.alunos)) {
    project.galeria.alunos.forEach((student, index) => {
      checks.push({
        key: `galeria.alunos[${index}].foto`,
        val: student.foto,
        required: true
      });
    });
  }

  return checks;
}

async function checkUrl(url) {
  try {
    const headResponse = await fetch(url, { method: 'HEAD' });
    if (headResponse.ok) {
      return { ok: true, status: headResponse.status };
    }

    const getResponse = await fetch(url);
    return { ok: getResponse.ok, status: getResponse.status };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

async function checkLocal(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

async function validateValue(baseDir, check) {
  if (isBlank(check.val)) {
    return {
      campo: check.key,
      status: check.required ? 'vazio' : 'pendente',
      observacao: check.required
        ? 'Recurso obrigatorio nao preenchido.'
        : 'Jogo ainda nao incluido nesta copia offline.'
    };
  }

  const value = check.val.toString().trim();

  if (REMOTE_URL_PATTERN.test(value)) {
    const result = await checkUrl(value);
    return { campo: check.key, tipo: 'remoto', valor: value, resultado: result };
  }

  const localPath = path.resolve(baseDir, value);
  const result = await checkLocal(localPath);
  return { campo: check.key, tipo: 'local', valor: localPath, resultado: result };
}

function summarize(report) {
  const summary = {
    projects: report.length,
    ok: 0,
    broken: 0,
    pendingGames: 0,
    missingRequired: 0
  };

  for (const project of report) {
    for (const check of project.verifica) {
      if (check.status === 'pendente') {
        summary.pendingGames += 1;
      } else if (check.status === 'vazio') {
        summary.missingRequired += 1;
      } else if (check.resultado && check.resultado.ok) {
        summary.ok += 1;
      } else {
        summary.broken += 1;
      }
    }
  }

  return summary;
}

async function main() {
  const root = path.resolve(__dirname, '..');
  console.log('Procurando arquivos de projetos em', root);

  const files = await findProjectFiles(root);
  if (!files.length) {
    console.log('Nenhum arquivo projetos.js encontrado.');
    return;
  }

  const report = [];

  for (const file of files) {
    const baseDir = path.dirname(file);
    const data = loadProjectData(file);

    if (!data || !Array.isArray(data.projetos)) {
      console.warn('Formato inesperado em', file);
      continue;
    }

    for (const project of data.projetos) {
      const entry = { file, id: project.id, verifica: [] };
      const checks = buildChecks(project);

      for (const check of checks) {
        entry.verifica.push(await validateValue(baseDir, check));
      }

      report.push(entry);
    }
  }

  const outPath = path.join(root, 'tools', 'validate_report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');

  const summary = summarize(report);
  console.log('Relatorio gerado em', outPath);
  console.log('Projetos verificados:', summary.projects);
  console.log('Recursos OK:', summary.ok);
  console.log('Jogos pendentes:', summary.pendingGames);
  console.log('Recursos obrigatorios vazios:', summary.missingRequired);
  console.log('Recursos quebrados:', summary.broken);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
