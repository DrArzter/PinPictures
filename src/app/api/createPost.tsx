import api from "./axiosApi";

export default async function createPost(Post: Post) {
  try {
    const formData = new FormData();

    // Добавление изображений в FormData
    Post.images.forEach((image, index) => {
      formData.append(`image[${index}]`, image);
    });

    // Добавление других данных в FormData (если нужно)
    formData.append("name", Post.name);
    formData.append("description", Post.description);

    // Отправка данных на сервер
    const response = await api.post("/post", formData, {
      withCredentials: true, // Передача куки при необходимости
    });

    return response?.data;
  } catch (error: any) {
    console.error(
      "Error creating post:",
      error.response?.data || error.message
    );
    throw error;
  }
}
