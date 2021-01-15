import { API_CHARACTER_ENDPOINT } from './helpers';

export async function fetchCharacter(id) {
  let response = await fetch(`${API_CHARACTER_ENDPOINT}/${id}`);
  let json = await response.json();

  return json.data;
}
