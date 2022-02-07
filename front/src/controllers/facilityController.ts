import agent from 'superagent';
import { IFacility } from '../models/IFacility';

export const getFacilities = async () => {
  const result = await agent.get('/api/facilities');
  console.log(result.body);
  return result.body as IFacility[];
};
