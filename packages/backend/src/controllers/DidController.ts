import { Controller } from "@tsed/di";
import { Get, Post, Summary } from "@tsed/schema";
import { PathParams } from "@tsed/common";
import { DidService } from "../services/DidService";
import { Did } from "../entity/Did";
import { Profile } from "../types";
import { getProfileFromCeramic } from "../common/ceramic-util";

@Controller("/did")
export class GetProfileController {
  constructor(private readonly DidService: DidService) {}

  @Get("/getAllDids")
  @Summary("Return the DIDs of all Disco users")
  async getAllDids(): Promise<string[]> {
    const result = await this.DidService.getAllDids();
    return result.map((r) => r.did);
  }

  @Post("/register/:did")
  @Summary("Register the given DID as a Disco user")
  async registerDid(@PathParams("did") did: string): Promise<boolean> {
    console.log("@TODO: Implement me using this.DidService");

    try {
      const result = this.DidService.registerDid(did);
      return result;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  @Get("/getProfileViaDid/:did")
  @Summary("Retrive the profile for a given DID")
  async getProfileViaDid(
    @PathParams("did") did: string
  ): Promise<Profile | undefined> {
    // example call: http://0.0.0.0:8083/v1/did/getProfileViaDid/did:3:kjzl6cwe1jw148uyox3goiyrwwe3aab8vatm3apxqisd351ww0dj6v5e3f61e8b

    return await getProfileFromCeramic(did);
  }

  @Get("/getAllProfiles")
  @Summary("Retrive the profiles of all Disco users")
  async getAllProfiles(): Promise<Profile[]> {
    const allDids = await this.DidService.getAllDids();
    const profiles = await Promise.all(
      allDids.map((r) => getProfileFromCeramic(r.did))
    );
    return profiles
      .map((p, index) => ({ ...p, did: allDids[index].did }))
      .filter((p) => p) as Profile[];
  }
}
