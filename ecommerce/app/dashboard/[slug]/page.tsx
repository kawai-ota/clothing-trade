import React from "react";
import prisma from "@/app/lib/prismadb";
import ImageGallery from "../ImageGallery";
import Info from "../Info";
import Slide from "../../components/Slide";
import Review from "@/app/components/Review";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import ReviewSection from "../ReviewSection";
import Navbar from "@/app/components/Navbar";
import Comment from "../Comment";
import { BiPlus } from "react-icons/bi";

type dashboardProps = {};

export default async function Page({ params }: { params: { slug: string } }) {
  const productId = parseInt(params.slug, 10);
  const session = await getServerSession(options);
  const currentUserId = session?.user.id;
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  const allReview = await prisma.review.findMany({
    where: {
      productId: productId,
    },
  });

  let averageRating = 0;
  if (allReview.length > 0) {
    const totalRating = allReview.reduce((acc, review) => {
      return acc + review.rating;
    }, 0);
    averageRating = totalRating / allReview.length;
  }

  const urlString = product?.images;

  return (
    <div className="max-w-[1280px] mx-auto px-5 py-5">
      <Navbar />
      <hr />
      <div className="flex flex-col space-y-2 mt-4">
        {product && (
          <div className="flex flex-row items-center">
            <h1 className="text-2xl font-semibold mr-2">{product.title}</h1>
            <span className="text-2xl mr-2">/</span>
            <h2 className="text-2xl font-medium opacity-70">{product.store}</h2>
          </div>
        )}
        <Comment rating={averageRating} numberComments={allReview.length} />
      </div>
      {product && (
        <div className="grid lg:grid-cols-2 grid-cols-1 mt-10 mb-10 gap-14">
          {urlString && <ImageGallery imageUrls={urlString} />}
          <Info {...product} />
        </div>
      )}
      <div className="grid lg:grid-cols-2 grid-cols-1 lg:mt-20">
        <div>
          <div className="flex items-center space-x-5 mb-10">
            <span className="w-[5px] h-[30px] bg-[#3EBCB5] rounded-full inline-block" />
            <span className="font-medium text-xl">この商品について</span>
          </div>
          <div>
            <hr className="w-9/12 my-3" />
            <div className="flex flex-row justify-between w-9/12 opacity-70 cursor-pointer">
              <span className="font-medium">概要</span>
              <BiPlus size={24} />
            </div>
          </div>
          <div>
            <hr className="w-9/12 my-3" />
            <div className="flex flex-row justify-between w-9/12 opacity-70 cursor-pointer">
              <span className="font-medium">商品詳細</span>
              <BiPlus size={24} />
            </div>
          </div>
        </div>
        <div className="lg:mt-0 mt-10">
          <div className="flex flex-col items-center space-x-5 mb-10">
            <div className="flex flex-row mb-5">
              <span className="w-[5px] h-[30px] bg-[#3EBCB5] rounded-full inline-block mr-5" />
              <span className="font-medium text-xl">スナップ</span>
            </div>
            {product && (
              <img
                src={product.images.split(",").pop()}
                className="max-h-[300px] w-10/12 rounded-lg object-contain"
                alt=""
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-20 mb-20">
        <div id="review-section" className="flex items-center space-x-5 mb-10">
          <span className="w-[5px] h-[30px] bg-[#3EBCB5] rounded-full inline-block" />
          <span className="font-medium text-xl">お客様のレビュー</span>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <div>
            {allReview.map((review, index) => (
              <div key={review.id} className="mb-5">
                <h1 className="mb-2 font-medium">コメント:{index + 1}</h1>
                <ReviewSection {...review} />
              </div>
            ))}
          </div>
          <Review productId={product?.id} userId={currentUserId} />
        </div>
      </div>
    </div>
  );
}
