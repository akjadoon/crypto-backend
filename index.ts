
import { startServer } from './server';
import { startJobs } from './jobs';
import { createModels } from './create_models';

const mode = process.argv[2];

const models = createModels();
if (mode === 'server')
    startServer(models);
else if (mode === 'jobs')
    startJobs(models);
