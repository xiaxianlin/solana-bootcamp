"use client";

import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import { useCrudProgram, useCrudProgramAccount } from "./crud-data-access";
import { useWallet } from "@solana/wallet-adapter-react";

export function CrudCreate() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { createEntry } = useCrudProgram();
  const { publicKey } = useWallet();

  const isFormValid = title.trim() !== "" && message.trim() !== "";

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };

  if (!publicKey) {
    return <p>Please connect your wallet!</p>;
  }

  return (
    <div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full max-w-xs"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Message</span>
        </label>
        <textarea
          placeholder="Message"
          className="input input-bordered w-full max-w-xs"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="form-control mt-6">
        <button
          className="btn btn-primary btn-xs lg:btn-md"
          onClick={handleSubmit}
          disabled={createEntry.isPending && !isFormValid}
        >
          Create
        </button>
      </div>
    </div>
  );
} 

export function CrudList() {
  const { accounts, getProgramAccount } = useCrudProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    );
  }
  return (
    <div className={"space-y-6"}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <CrudCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={"text-2xl"}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function CrudCard({ account }: { account: PublicKey }) {
  const { publicKey } = useWallet();
  const { accountQuery, updateEntry, deleteEntry } = useCrudProgramAccount({ account });
  const [message, setMessage] = useState("");
  const title = accountQuery.data?.title ?? "";

  const isFormValid = message.trim() !== "";

  const handleUpdate = () => {
    if (publicKey && isFormValid) {
      updateEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };

  const handleDelete = () => {
    if (publicKey) {
      deleteEntry.mutateAsync(title);
    }
  };

  if (accountQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2 className="card-title justify-center text-3xl cursor-pointer" onClick={() => accountQuery.refetch()}>
            {title}
          </h2>
          <p>{accountQuery.data?.message}</p>
          <div className="card-actions justify-around">
            <textarea
              placeholder="Message"
              className="input input-bordered w-full max-w-xs"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={handleUpdate}
              disabled={updateEntry.isPending}
            >
              Update Journal Entry
            </button>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (!window.confirm("Are you sure you want to close this account?")) {
                  return;
                }
                return title && deleteEntry.mutateAsync(title);
              }}
              disabled={deleteEntry.isPending}
            >
              Delete
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
