import axios from "axios";

const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response
  } catch (error) {
    console.error(error);
  }
};

export default fetchData;