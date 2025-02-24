"use client";

import { Tag } from "@/types/tag";
import { deleteTag } from "@/lib/apis/tag";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils/formatDate";
import { useState } from "react";

interface TagListProps {
  tags: Tag[];
}

export default function TagList({ tags }: TagListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(id);
      await deleteTag(id);
    } catch (error) {
      console.error("Failed to delete tag:", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.name}</TableCell>
              <TableCell>{tag.slug}</TableCell>
              <TableCell>{formatDate(tag.created_at)}</TableCell>
              <TableCell>{formatDate(tag.updated_at)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isLoading === tag.id}
                  onClick={() => handleDelete(tag.id)}
                >
                  {isLoading === tag.id ? "Deleting..." : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
