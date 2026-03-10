"use client";

import { Plus, Upload } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Category = {
  id: number;
  name: string;
  createdAt: Date;
};

type FormState = {
  title: string;
  description: string;
  categoryId: string;
  file: File | null;
};

type CloudinarySignature = {
  signature: string;
  timestamp: string;
  apiKey: string;
};

interface UploadDialogProps {
  categories: Category[];
}

function UploadAsset({ categories }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressStatus, setUploadProgressStatus] = useState(0);
  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    categoryId: "",
    file: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormState((prev) => ({ ...prev, categoryId: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormState((prev) => ({ ...prev, file }));
    }
  };

  async function getCloudinarySignauter(): Promise<CloudinarySignature> {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const response = await fetch("/api/cloudinary/signature", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ timestamp }),
    });

    if (!response.ok) {
      throw new Error("Failed to create cloudinary signature");
    }

    return response.json();
  }

  const handleAssetUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUploading(true);
    setUploadProgressStatus(0);
    try {
      const { signature, apiKey, timestamp } = await getCloudinarySignauter();
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", formState.file as File);
      cloudinaryData.append("api_key", apiKey);
      cloudinaryData.append("timestamp", timestamp.toString());
      cloudinaryData.append("signature", signature);
      cloudinaryData.append("folder", "next-asset-manager");

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgressStatus(progress);
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cloudinaryPromise = new Promise<any>(async (resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject(new Error("Upload to cloudinary failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload to cloudinary failed"));

        const cloudinaryResponse = await cloudinaryPromise;
        console.log(cloudinaryResponse);

        const formData = new FormData();
        formData.append("title", formState.title);
        formData.append("description", formState.description);
        formData.append("categoryId", formState.categoryId);
        formData.append("fileUrl", cloudinaryResponse.secure_url);
        formData.append("thumbUrl", cloudinaryResponse.secure_url);
      });
      xhr.send(cloudinaryData);
    } catch (error) {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
          <Plus className="h-4 w-5 mr-2" />
          Upload Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]:">
        <DialogHeader>
          <DialogTitle>Upload New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAssetUpload} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              value={formState.title}
              id="title"
              name="title"
              onChange={handleInputChange}
              placeholder="Title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              value={formState.description}
              id="description"
              name="description"
              onChange={handleInputChange}
              placeholder="Description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formState.categoryId}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              onChange={handleFileChange}
              type="file"
              accept="image/*"
            />
          </div>
          <DialogFooter>
            <Button type="submit">
              <Upload className="h-5 w-5 mr-2" />
              Upload Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadAsset;
