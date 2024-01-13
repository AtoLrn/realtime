import 'reflect-metadata'; // MANDATORY AS WE USE THIS FOR INJECTION

import { container } from "../inversify.config";
import { TYPES } from '../infrastructure';
import { IUuid } from './uuid.services';

describe('UuidService', () => {
  const service = container.get<IUuid>(TYPES.UuidService);

  test('generateUuid', async () => {
      expect(service.generateUuid()).not.toBe('')
  })
})
