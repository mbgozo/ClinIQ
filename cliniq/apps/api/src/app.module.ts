import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { QaModule } from "./qa/qa.module";

@Module({
  imports: [AuthModule, QaModule],
  controllers: [],
  providers: []
})
export class AppModule {}


