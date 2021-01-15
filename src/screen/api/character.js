import axios from 'axios';
import { API_CHARACTER_ENDPOINT } from '../../common/helpers';

export async function getCharacter(id) {
  const { data } = await axios.get(`${API_CHARACTER_ENDPOINT}/${id}`);
  return data.data;
}
