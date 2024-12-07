import Image from "next/image";
export default function Admin() {
  return (
    <div>
      <Image
        alt="Select something to see sekrit documents"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="w-full h-auto"
        src="https://storage.yandexcloud.net/pinpictures/otherImages/FgqntNsK7rfojfx4EPbo_X_4ex56NmbkPoZizljqxF2HqgzQPYW92M7EzSi2NitWgYnaQIQxQSeoKC1FkzGyzZdm.jpg"
      />
    </div>
  );
}
