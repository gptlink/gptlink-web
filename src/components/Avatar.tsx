const Avatar = ({ time }: { time?: number }) => {
  return (
    <div className="flex items-center gap-2 text-base">
      <img
        className="w-8 h-8 rounded-full"
        src="https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIm0q06mdqTumC0zFkOCRUAPRWSeId450ViaEAgvYKDHUvGFq33WZPdgGbRgY28PBAic8OOxpcHtOAg/132"
        alt=""
      />
      <div>
        PengYYY
        {time && <div className="text-sm text-slate-500">有效次数: {time}</div>}
      </div>
    </div>
  );
};

export default Avatar;
