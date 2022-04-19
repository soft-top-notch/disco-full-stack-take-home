import { Injectable } from "@tsed/di";
import { TypeORMService } from "@tsed/typeorm";
import { Connection } from "typeorm";
import { DidRepository } from "../repositories/DidRepository";
import { Did } from "../entity/Did";

@Injectable()
export class DidService {
  private connection: Connection;

  constructor(
    private typeORMService: TypeORMService,
    public DidRepository: DidRepository
  ) {}

  $afterRoutesInit() {
    this.connection = this.typeORMService.get("default")!;
  }

  async registerDid(did: string): Promise<boolean> {
    const existingItems = await this.DidRepository.find({ did: did });
    if (!!existingItems.length) {
      console.log("The did is already existing");
      return false;
    }
    const newDid = new Did();
    newDid.did = did;
    console.log("Saved new DID:", newDid);
    await this.connection.manager.save(newDid);
    return true;
  }

  async getAllDids(): Promise<Did[]> {
    const users = await this.DidRepository.findAllDids();
    return users;
  }
}
